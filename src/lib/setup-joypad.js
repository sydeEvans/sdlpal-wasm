import 'joypad.js';

joypad.on('connect', (e) => {
    const {id} = e.gamepad;

    console.log(`${id} connected!`);
});

joypad.set({
    vibration: {
        startDelay: 500,
        duration: 3000,
        weakMagnitude: 1,
        strongMagnitude: 1,
    },
});

joypad.on('axis_move', e => {
    console.log(e.detail);
});

const keycodeMap = {
    'up': 38,
    'right': 39,
    'down': 40,
    'left': 37,
    'space': 32,
    'esc': 27,
    'r': 82,
    's': 83,
};

const joyNameMap = {
    'button_12': 'up',
    'button_15': 'right',
    'button_13': 'down',
    'button_14': 'left',
    'button_0': 'space',
    'button_9': 'esc',
    'button_1': 'esc',
    'button_2': 's',
    'button_3': 'r',
}

joypad.on('button_press', e => {
    // console.log('button_press', e.detail);
    const {buttonName} = e.detail;

    simulateKeyEvent('keydown', keycodeMap[joyNameMap[buttonName]], 0)
});

joypad.on('button_release', e => {
    // console.log('button_release', e.detail);
    const {buttonName} = e.detail;

    simulateKeyEvent('keyup', keycodeMap[joyNameMap[buttonName]], 0)
});

// document.onkeydown = function (event) {
//     console.log(event)
// };

function simulateKeyEvent(eventType, keyCode, charCode) {
    var e = document.createEventObject ? document.createEventObject() : document.createEvent("Events");
    if (e.initEvent) e.initEvent(eventType, true, true);

    e.keyCode = keyCode;
    e.which = keyCode;
    e.charCode = charCode;

    // Dispatch directly to Emscripten's html5.h API (use this if page uses emscripten/html5.h event handling):
    if (typeof JSEvents !== 'undefined' && JSEvents.eventHandlers && JSEvents.eventHandlers.length > 0) {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if ((JSEvents.eventHandlers[i].target == Module['canvas'] || JSEvents.eventHandlers[i].target == window)
                && JSEvents.eventHandlers[i].eventTypeString == eventType) {
                JSEvents.eventHandlers[i].handlerFunc(e);
            }
        }
    } else {
        // Dispatch to browser for real (use this if page uses SDL or something else for event handling):
        Module['canvas'].dispatchEvent ? Module['canvas'].dispatchEvent(e) : Module['canvas'].fireEvent("on" + eventType, e);
    }
}

window.simulateKeyEvent = simulateKeyEvent;