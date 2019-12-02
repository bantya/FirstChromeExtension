let canvas, ctx, fullscreen;

const toggleDesignMode = () => {
    document.designMode = document.designMode == 'off' ? 'on' : 'off';

    saveState({ designMode: document.designMode });

    return {
        type: 'toggle-design-mode',
        payload: document.designMode
    };
};

const takeScreenshot = () => {
    chrome.runtime.sendMessage({ type: 'capture-visible-tab' });
};

const checkedFullscreen = data => {
    fullscreen = data.status;
};

let fullHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
);

let fullWidth = Math.max(
  document.body.scrollWidth, document.documentElement.scrollWidth,
  document.body.offsetWidth, document.documentElement.offsetWidth,
  document.body.clientWidth, document.documentElement.clientWidth
);

const drawImage = data => {
    canvas = document.createElement('canvas');
    canvas.width = fullscreen === true ? fullWidth : window.innerWidth;
    canvas.height = fullscreen === true ? fullHeight : window.innerHeight;
    ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = data.dataURL;

    image.onload = () => {
        ctx.drawImage(image, 0, 0);
        download();
    };
};

const download = () => {
    const link = document.createElement('a');
    link.download = `screenshot-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL();
    link.click();
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
    'get-state': getState,
    'take-screenshot': takeScreenshot,
    'draw-image': drawImage,
    'checked-fullscreen': checkedFullscreen
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
    const reply = actions[request.type] && actions[request.type](request);

    reply && response(reply);
});
