// content.js - UI Logic (Main World)

// Menu Injection
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
                checkForMenu(node);
            }
        }
    }
});

// Watch body for menu portals
observer.observe(document.body, { childList: true, subtree: true });

function checkForMenu(rootNode) {
    if (!rootNode.querySelector) return;

    const readAloudSelector = '[data-testid="voice-play-turn-action-button"]';
    const readAloudBtn = rootNode.matches(readAloudSelector) ? rootNode : rootNode.querySelector(readAloudSelector);

    if (readAloudBtn) {
        injectDownloadButton(readAloudBtn);
    }
}

function injectDownloadButton(targetBtn) {
    const parent = targetBtn.parentNode;
    if (parent.querySelector('.__download-audio-item')) return;

    const clone = targetBtn.cloneNode(true);
    clone.classList.add('__download-audio-item');
    clone.removeAttribute('data-testid');
    clone.setAttribute('aria-label', 'Download Audio');
    clone.removeAttribute('id');

    const svg = clone.querySelector('svg');
    if (svg) {
        svg.innerHTML = '<path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path>';
        if (!svg.getAttribute('viewBox')) svg.setAttribute('viewBox', '0 0 24 24');
    }

    const textContainer = clone.querySelector('.truncate');
    if (textContainer) {
        textContainer.textContent = 'Download Audio';
    }

    clone.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.__downloadOnNextSynthesize = true;
        targetBtn.click();
    });

    targetBtn.after(clone);
}
