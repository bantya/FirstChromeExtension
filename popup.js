let state;
let toggleBtn = document.getElementById('toggle-design-mode-btn');

const init = () => {
    broadcast({ type: 'get-state' });
};

const setButtonText = text => {
    toggleBtn.innerHTML = text === 'on' ? 'Disable' : 'Enable';
};

const toggleDesignMode = () => {
    broadcast({ type: 'toggle-design-mode' });
}

const takeScreenshot = () => {
    broadcast({ type: 'take-screenshot' });
};


const changeChackboxStatus = (e) => {
    broadcast({ type: 'checked-fullscreen', status: e.target.checked });
};

const broadcast = message => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, message, response => {
            if (!response) return;

            switch (response.type) {
                case 'toggle-design-mode':
                    setButtonText(response.payload);
                    break;
                case 'get-state':
                    state = response.payload;

                    setButtonText(state.designMode);
                    break;
                default:
            }
        });
    });
}

document.getElementById('toggle-design-mode-btn').onclick = toggleDesignMode;
document.getElementById('take-visible-screenshot-btn').onclick = takeScreenshot;
document.getElementById('full-page').onchange = changeChackboxStatus;

window.onload = () => {
    init();
};
