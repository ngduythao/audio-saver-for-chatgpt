(function() {
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        try {
            const [resource, config] = args;
            const url = (typeof resource === 'string') ? resource : resource?.url;

            if (url && (url.includes('/backend-api/') || url.startsWith('https://chatgpt.com/backend-api/'))) {
                let auth = null;
                
                // Check config object (2nd argument)
                if (config && config.headers) {
                    if (config.headers instanceof Headers) {
                        auth = config.headers.get('Authorization');
                    } else {
                        // Check for common casing
                        auth = config.headers['Authorization'] || config.headers['authorization'];
                    }
                }

                // Check Request object (1st argument)
                if (!auth && resource instanceof Request) {
                     auth = resource.headers.get('Authorization');
                }

                if (auth) {
                    window.__gptAuthToken = auth;
                }
            }
        } catch (e) {
            // Silently fail to avoid breaking app
        }
        return originalFetch.apply(this, args);
    };
    // console.log('ChatGPT Audio Sniffer Loaded');
})();
