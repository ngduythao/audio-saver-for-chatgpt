(function() {
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        try {
            const [resource, config] = args;
            const url = (typeof resource === 'string') ? resource : resource?.url;

            if (url && (url.includes('/backend-api/') || url.startsWith('https://chatgpt.com/backend-api/'))) {
                let auth = null;

                if (config && config.headers) {
                    if (config.headers instanceof Headers) {
                        auth = config.headers.get('Authorization');
                    } else {
                        auth = config.headers['Authorization'] || config.headers['authorization'];
                    }
                }

                if (!auth && resource instanceof Request) {
                     auth = resource.headers.get('Authorization');
                }

                if (auth) {
                    window.__gptAuthToken = auth;
                }

                // Intercept synthesize request to download audio
                if (url.includes('/backend-api/synthesize') && window.__downloadOnNextSynthesize) {
                    window.__downloadOnNextSynthesize = false;
                    const response = await originalFetch.apply(this, args);
                    response.clone().blob().then(blob => {
                        const urlObj = new URL(url.startsWith('http') ? url : `https://chatgpt.com${url}`);
                        const msgId = urlObj.searchParams.get('message_id');
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = `audio-${msgId}.aac`;
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(blobUrl); }, 100);
                    });
                    return response;
                }
            }
        } catch (e) {
            // Silently fail to avoid breaking app
        }
        return originalFetch.apply(this, args);
    };
})();
