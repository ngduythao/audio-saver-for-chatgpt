// content.js - UI Logic (Main World)

// 1. Context Capture
document.addEventListener('click', (e) => {
    // Detect clicks on "More actions" (the ... button)
    // Selector: button[aria-label="More actions"]
    const btn = e.target.closest('button[aria-label="More actions"]');
    if (btn) {
        const article = btn.closest('article');
        if (article) {
            // Extract Message ID
            // Strategy: Look for data-message-id on article or its children
            let msgId = article.getAttribute('data-message-id');
            
            if (!msgId) {
                // Fallback: search inside article
                const idNode = article.querySelector('[data-message-id]');
                if (idNode) msgId = idNode.getAttribute('data-message-id');
            }

            if (msgId) {
                window.__targetMessageId = msgId;
                // console.log('Captured Target Message ID:', msgId);
            }
        }
    }
}, true); // Use capture to ensure we see the click

// 2. Menu Injection
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Element
                checkForMenu(node);
            }
        }
    }
});

// Watch body for menu portals
observer.observe(document.body, { childList: true, subtree: true });

function checkForMenu(rootNode) {
    if (!rootNode.querySelector) return;

    // Target the "Read aloud" button
    const readAloudSelector = 'div[data-testid="voice-play-turn-action-button"]';
    
    // Check if the added node is the button or contains it
    const readAloudBtn = rootNode.matches(readAloudSelector) ? rootNode : rootNode.querySelector(readAloudSelector);

    if (readAloudBtn) {
        injectDownloadButton(readAloudBtn);
    }
}

function injectDownloadButton(targetBtn) {
    // Avoid duplicates
    // We check the parent container for our custom class
    const parent = targetBtn.parentNode;
    if (parent.querySelector('.__download-audio-item')) return;

    // 3. Cloning Strategy
    const clone = targetBtn.cloneNode(true);
    
    // Modify Attributes
    clone.classList.add('__download-audio-item');
    clone.removeAttribute('data-testid');
    clone.setAttribute('aria-label', 'Download Audio');

    // Modify ID (if any) to avoid conflict
    clone.removeAttribute('id');

    // Modify Icon
    const svg = clone.querySelector('svg');
    if (svg) {
        // Replace with standard Download icon
        svg.innerHTML = '<path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path>';
        if (!svg.getAttribute('viewBox')) svg.setAttribute('viewBox', '0 0 24 24');
    }

    // Modify Text
    const textContainer = clone.querySelector('.truncate');
    if (textContainer) {
        textContainer.textContent = 'Download Audio';
    }

    // 4. Download Logic
    clone.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Trigger Download
        await handleDownload();

        // Close Menu
        // Simulate Escape key press as it's the standard way to close accessible menus
        const escEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true,
            view: window
        });
        document.dispatchEvent(escEvent);
    });

    // Insert
    // "Insert the cloned button immediately after the original 'Read aloud' button"
    targetBtn.after(clone);
}

async function handleDownload() {
    const msgId = window.__targetMessageId;
    const token = window.__gptAuthToken;

    if (!token) {
        alert('Authorization token not found. Please refresh the page or generate a new response to capture it.');
        return;
    }
    if (!msgId) {
        alert('Message ID not found. Please try opening the menu again.');
        return;
    }

    // Try to find conversation ID from URL
    // Format: /c/UUID
    const match = window.location.pathname.match(/\/c\/([a-f0-9-]+)/);
    const conversationId = match ? match[1] : '';

    // Construct API URL
    const params = new URLSearchParams({
        message_id: msgId,
        conversation_id: conversationId,
        voice: 'cove',
        format: 'aac'
    });
    const url = `https://chatgpt.com/backend-api/synthesize?${params.toString()}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': token
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        // Create invisible link and click
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `audio-${msgId}.aac`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        }, 100);

    } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download audio. See console for details.');
    }
}
