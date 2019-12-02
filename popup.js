const toggleDesignMode = () => {
    broadcast({ type: 'toggle-design-mode' });
}

const broadcast = message => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, message, response => {
            if (!response) return;

            switch (response.type) {
                case 'toggle-design-mode':
                    document.getElementById('toggle-design-mode-btn').innerHTML = response.payload === 'on' ? 'Disable' : 'Enable';
                    break;
                default:
            }
        });
    });
}

document.getElementById('toggle-design-mode-btn')
    .onclick = toggleDesignMode;
