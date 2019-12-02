const toggleDesignMode = () => {
    document.designMode = document.designMode == 'on' ? 'off' : 'on';

    return { type: 'toggle-design-mode', payload: document.designMode };
};

const actions = {
    'toggle-design-mode': toggleDesignMode
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
    const reply = actions[request.type] && actions[request.type]();

    reply && response(reply);
});
