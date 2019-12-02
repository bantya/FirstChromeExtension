const toggleDesignMode = () => {
    document.designMode = document.designMode == 'off' ? 'on' : 'off';
    saveState({ designMode: document.designMode });

    return {
        type: 'toggle-design-mode',
        payload: document.designMode
    };
};

const getState = () => {
    const state = sessionStorage.getItem('state-toggle-design-mode');

    return {
        type: 'get-state',
        payload: state ? JSON.parse(state) : { designMode: document.designMode }
    };
};

const saveState = payload => {
    sessionStorage.setItem('state-toggle-design-mode', JSON.stringify(payload));
};

const actions = {
    'toggle-design-mode': toggleDesignMode,
    'get-state': getState
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
    const reply = actions[request.type] && actions[request.type]();

    reply && response(reply);
});
