const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const ARDUINO = require('../../io/arduino'); 
const Base64Util = require('../../util/base64-util');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

/**
 * Enum for arduino ARDUINO command protocol.
 * https://github.com/LLK/scratch-arduino-firmware/blob/master/protocol.md
 * @readonly
 * @enum {number}
 */
const BLECommand = {
    CMD_PIN_CONFIG: 0x80,
    CMD_DISPLAY_TEXT: 0x81,
    CMD_DISPLAY_LED: 0x82
};


/**
 * A time interval to wait (in milliseconds) before reporting to the ARDUINO socket
 * that data has stopped coming from the peripheral.
 */
const BLETimeout = 4500;

/**
 * A time interval to wait (in milliseconds) while a block that sends a ARDUINO message is running.
 * @type {number}
 */
const BLESendInterval = 100;

/**
 * A string to report to the ARDUINO socket when the arduino has stopped receiving data.
 * @type {string}
 */
const BLEDataStoppedError = 'arduino extension stopped receiving data';

/**
 * Enum for arduino protocol.
 * https://github.com/LLK/scratch-arduino-firmware/blob/master/protocol.md
 * @readonly
 * @enum {string}
 */
const BLEUUID = {
    service: 0xf005,
    rxChar: '5261da01-fa7e-42ab-850b-7c80220097cc',
    txChar: '5261da02-fa7e-42ab-850b-7c80220097cc'
};


class ARDUINO_SIMULATOR extends ARDUINO {

    /**
     * A BLE peripheral socket object.  It handles connecting, over web sockets, to
     * BLE peripherals, and reading and writing data to them.
     * @param {Runtime} runtime - the Runtime for sending/receiving GUI update events.
     * @param {string} extensionId - the id of the extension using this socket.
     * @param {object} peripheralOptions - the list of options for peripheral discovery.
     * @param {object} connectCallback - a callback for connection.
     * @param {object} resetCallback - a callback for resetting extension state.
     */
    constructor (runtime, extensionId, peripheralOptions, connectCallback, resetCallback = null) {
        super(runtime, extensionId, peripheralOptions, connectCallback, resetCallback , 'ARDUINO_SIMULATOR' );
    }
 
}

/**
 * Manage communication with a Arduino peripheral over a Scrath Link client socket.
 */
class Arduino {

    /**
     * Construct a Arduino communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor(runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;

        /**
         * The BluetoothLowEnergy connection socket for reading/writing peripheral data.
         * @type {ARDUINO}
         * @private
         */
        this._arduino = null;
        this._runtime.registerPeripheralExtension(extensionId, this);

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._extensionId = extensionId;

        /**
         * The most recently received value for each sensor.
         * @type {Object.<string, number>}
         * @private
         */
        this._sensors = {
            tiltX: 0,
            tiltY: 0,
            buttonA: 0,
            buttonB: 0,
            touchPins: [0, 0, 0],
            gestureState: 0,
            ledMatrixState: new Uint8Array(5)
        };

        /**
         * The most recently received value for each gesture.
         * @type {Object.<string, Object>}
         * @private
         */
        this._gestures = {
            moving: false,
            move: {
                active: false,
                timeout: false
            },
            shake: {
                active: false,
                timeout: false
            },
            jump: {
                active: false,
                timeout: false
            }
        };

        /**
         * Interval ID for data reading timeout.
         * @type {number}
         * @private
         */
        this._timeoutID = null;

        /**
         * A flag that is true while we are busy sending data to the ARDUINO socket.
         * @type {boolean}
         * @private
         */
        this._busy = false;

        /**
         * ID for a timeout which is used to clear the busy flag if it has been
         * true for a long time.
         */
        this._busyTimeoutID = null;

        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }

    /**
     * @param {string} text - the text to display.
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    displayText(text) {
        const output = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) {
            output[i] = text.charCodeAt(i);
        }
        return this.send(BLECommand.CMD_DISPLAY_TEXT, output);
    }

    /**
     * @param {Uint8Array} matrix - the matrix to display.
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    displayMatrix(matrix) {
        return this.send(BLECommand.CMD_DISPLAY_LED, matrix);
    }

    /**
     * @return {number} - the latest value received for the tilt sensor's tilt about the X axis.
     */
    get tiltX() {
        return this._sensors.tiltX;
    }

    /**
     * @return {number} - the latest value received for the tilt sensor's tilt about the Y axis.
     */
    get tiltY() {
        return this._sensors.tiltY;
    }

    /**
     * @return {boolean} - the latest value received for the A button.
     */
    get buttonA() {
        return this._sensors.buttonA;
    }

    /**
     * @return {boolean} - the latest value received for the B button.
     */
    get buttonB() {
        return this._sensors.buttonB;
    }

    /**
     * @return {number} - the latest value received for the motion gesture states.
     */
    get gestureState() {
        return this._sensors.gestureState;
    }

    /**
     * @return {Uint8Array} - the current state of the 5x5 LED matrix.
     */
    get ledMatrixState() {
        return this._sensors.ledMatrixState;
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    scan() {
        if (this._arduino) {
            this._arduino.disconnect();
        }
        if(this._extensionId =="pinoosimulator"){

            this._arduino = new ARDUINO_SIMULATOR(this._runtime, this._extensionId, {
                filters: [
                    { namePrefix: 'w' }
                ]
            }, this._onConnect, this.reset, 'ARDUINO_SIMULATOR');
        }else{

            this._arduino = new ARDUINO(this._runtime, this._extensionId, {
                filters: [
                    { namePrefix: 'w' }
                ]
            }, this._onConnect, this.reset); 
        }
    }

    /**
     * Called by the runtime when user wants to connect to a certain peripheral.
     * @param {number} id - the id of the peripheral to connect to.
     */
    connect(id) {
        if (this._arduino) {
            this._arduino.connectPeripheral(id);
        }
    }

    /**
     * Disconnect from the arduino.
     */
    disconnect() {
        if (this._arduino) {
            this._arduino.disconnect();
        }

        this.reset();
    }

    /**
     * Reset all the state and timeout/interval ids.
     */
    reset() {
        if (this._timeoutID) {
            window.clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }

    /**
     * Return true if connected to the arduino.
     * @return {boolean} - whether the arduino is connected.
     */
    isConnected() {
        let connected = false;
        if (this._arduino) {
            connected = this._arduino.isConnected();
        }
        return connected;
    }

    /**
     * Send a message to the peripheral ARDUINO socket.
     * @param {number} command - the ARDUINO command hex.
     * @param {Uint8Array} message - the message to write
     */
    send(command, message) {
        if (!this.isConnected()) return;
        if (this._busy) return;

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        this._busy = true;

        // Set a timeout after which to reset the busy flag. This is used in case
        // a ARDUINO message was sent for which we never received a response, because
        // e.g. the peripheral was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

        // const output = new Uint8Array(message.length + 1);
        // output[0] = command; // attach command to beginning of message
        // for (let i = 0; i < message.length; i++) {
        //     output[i + 1] = message[i];
        // }
        // const data = Base64Util.uint8ArrayToBase64(output);

        return this._arduino.write(BLEUUID.service, BLEUUID.txChar, message, 'base64', true).then(
            (readValue, b, c) => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
                return readValue;
            }
        );
    }

    /**
     * Starts reading data from peripheral after ARDUINO has connected to it.
     * @private
     */
    _onConnect() {
        // this._arduino.read(BLEUUID.service, BLEUUID.rxChar, true, this._onMessage);
        // this._timeoutID = window.setTimeout(
        //     () => this._arduino.handleDisconnectError(BLEDataStoppedError),
        //     BLETimeout
        // );
    }

    /**
     * Process the sensor data from the incoming ARDUINO characteristic.
     * @param {object} base64 - the incoming ARDUINO data.
     * @private
     */
    _onMessage(base64) {
        // parse data
        const data = Base64Util.base64ToUint8Array(base64);

        this._sensors.tiltX = data[1] | (data[0] << 8);
        if (this._sensors.tiltX > (1 << 15)) this._sensors.tiltX -= (1 << 16);
        this._sensors.tiltY = data[3] | (data[2] << 8);
        if (this._sensors.tiltY > (1 << 15)) this._sensors.tiltY -= (1 << 16);

        this._sensors.buttonA = data[4];
        this._sensors.buttonB = data[5];

        this._sensors.touchPins[0] = data[6];
        this._sensors.touchPins[1] = data[7];
        this._sensors.touchPins[2] = data[8];

        this._sensors.gestureState = data[9];

        // cancel disconnect timeout and start a new one
        window.clearTimeout(this._timeoutID);
        this._timeoutID = window.setTimeout(
            () => this._arduino.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

    /**
     * @param {number} pin - the pin to check touch state.
     * @return {number} - the latest value received for the touch pin states.
     * @private
     */
    _checkPinState(pin) {
        return this._sensors.touchPins[pin];
    }
}

/**
 * Enum for tilt sensor direction.
 * @readonly
 * @enum {string}
 */
const ArduinoTiltDirection = {
    FRONT: 'front',
    BACK: 'back',
    LEFT: 'left',
    RIGHT: 'right',
    ANY: 'any'
};

/**
 * Enum for arduino gestures.
 * @readonly
 * @enum {string}
 */
const ArduinoGestures = {
    MOVED: 'moved',
    SHAKEN: 'shaken',
    JUMPED: 'jumped'
};

/**
 * Enum for arduino buttons.
 * @readonly
 * @enum {string}
 */
const ArduinoPins = {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: '11',
    12: '12',
    13: '13'
};

/**
 * Enum for arduino pin states.
 * @readonly
 * @enum {string}
 */
const ArduinoPinState = {
    ON: 'on',
    OFF: 'off'
};

/**
 * Scratch 3.0 blocks to interact with a Arduino peripheral.
 */
class Scratch3ArduinoBlocks {


    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME() {
        return 'pinoo';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return 'pinoo';
    }

    /**
     * @return {number} - the tilt sensor counts as "tilted" if its tilt angle meets or exceeds this threshold.
     */
    static get TILT_THRESHOLD() {
        return 15;
    }

    /**
     * @return {array} - text and values for each buttons menu element
     */
    get BUTTONS_MENU() {
        return [
            {
                text: 'A',
                value: ArduinoPins.A
            },
            {
                text: 'B',
                value: ArduinoPins.B
            },
            {
                text: formatMessage({
                    id: 'arduino.buttonsMenu.any',
                    default: 'any',
                    description: 'label for "any" element in button picker for arduino extension'
                }),
                value: ArduinoPins.ANY
            }
        ];
    }

    /**
     * @return {array} - text and values for each gestures menu element
     */
    get GESTURES_MENU() {
        return [
            {
                text: formatMessage({
                    id: 'arduino.gesturesMenu.moved',
                    default: 'moved',
                    description: 'label for moved gesture in gesture picker for arduino extension'
                }),
                value: ArduinoGestures.MOVED
            },
            {
                text: formatMessage({
                    id: 'arduino.gesturesMenu.shaken',
                    default: 'shaken',
                    description: 'label for shaken gesture in gesture picker for arduino extension'
                }),
                value: ArduinoGestures.SHAKEN
            },
            {
                text: formatMessage({
                    id: 'arduino.gesturesMenu.jumped',
                    default: 'jumped',
                    description: 'label for jumped gesture in gesture picker for arduino extension'
                }),
                value: ArduinoGestures.JUMPED
            }
        ];
    }

    /**
     * @return {array} - text and values for each pin state menu element
     */
    get PIN_STATE_MENU() {
        return [
            {
                text: formatMessage({
                    id: 'arduino.pinStateMenu.on',
                    default: 'on',
                    description: 'label for on element in pin state picker for arduino extension'
                }),
                value: ArduinoPinState.ON
            },
            {
                text: formatMessage({
                    id: 'arduino.pinStateMenu.off',
                    default: 'off',
                    description: 'label for off element in pin state picker for arduino extension'
                }),
                value: ArduinoPinState.OFF
            }
        ];
    }

    /**
     * @return {array} - text and values for each tilt direction menu element
     */
    get TILT_DIRECTION_MENU() {
        return [
            {
                text: formatMessage({
                    id: 'arduino.tiltDirectionMenu.front',
                    default: 'front',
                    description: 'label for front element in tilt direction picker for arduino extension'
                }),
                value: ArduinoTiltDirection.FRONT
            },
            {
                text: formatMessage({
                    id: 'arduino.tiltDirectionMenu.back',
                    default: 'back',
                    description: 'label for back element in tilt direction picker for arduino extension'
                }),
                value: ArduinoTiltDirection.BACK
            },
            {
                text: formatMessage({
                    id: 'arduino.tiltDirectionMenu.left',
                    default: 'left',
                    description: 'label for left element in tilt direction picker for arduino extension'
                }),
                value: ArduinoTiltDirection.LEFT
            },
            {
                text: formatMessage({
                    id: 'arduino.tiltDirectionMenu.right',
                    default: 'right',
                    description: 'label for right element in tilt direction picker for arduino extension'
                }),
                value: ArduinoTiltDirection.RIGHT
            }
        ];
    }

    /**
     * @return {array} - text and values for each tilt direction (plus "any") menu element
     */
    get TILT_DIRECTION_ANY_MENU() {
        return [
            ...this.TILT_DIRECTION_MENU,
            {
                text: formatMessage({
                    id: 'arduino.tiltDirectionMenu.any',
                    default: 'any',
                    description: 'label for any direction element in tilt direction picker for arduino extension'
                }),
                value: ArduinoTiltDirection.ANY
            }
        ];
    }

    /**
     * Construct a set of Arduino blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor(runtime, extensionId=Scratch3ArduinoBlocks.EXTENSION_ID) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new Arduino peripheral instance
        this._peripheral = new Arduino(this.runtime, extensionId);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: Scratch3ArduinoBlocks.EXTENSION_ID,
            name: Scratch3ArduinoBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'digital_write',
                    blockType: BlockType.COMMAND,
                    text: 'Set Pin [PIN] to [ON_OFF]',
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '7',
                            menu: "digital_pins"
                        },
                        ON_OFF: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0',
                            menu: "on_off"
                        }
                    }
                }, {
                    opcode: 'set_pin_mode',
                    blockType: BlockType.COMMAND,
                    text: 'Set Pin [PIN] mode to [PIN_MODE]',
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '7',
                            menu: "digital_pins"
                        },
                        PIN_MODE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0',
                            menu: "pin_mode"
                        }
                    }
                },
                {
                    opcode: 'pin_equals',
                    text: formatMessage({
                        id: 'arduino.whenPinEquals',
                        default: 'when pin [PIN] is [ON_OFF]',
                        description: 'when a pin is on or off'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '7',
                            menu: "digital_pins"
                        },
                        ON_OFF: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0',
                            menu: "on_off"
                        }
                    }
                },
                {
                    opcode: 'uploadDevMode',
                    text: formatMessage({
                        id: 'arduino.uploadDevMode',
                        default: 'Upload Dev Mode Script',
                        description: 'Upload Dev Mode Script'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                },
                {
                    opcode: 'uploadRunMode',
                    text: formatMessage({
                        id: 'arduino.uploadRunMode',
                        default: 'Upload Run Mode Script',
                        description: 'Upload Run Mode Script'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                }
            ],
            menus: {
                digital_pins: {
                    acceptReporters: true,
                    items: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
                        '12', '13', '14', '15', '16', '17', '18', '19']
                },
                on_off: {
                    acceptReporters: true,
                    items: [{ text: "LOW", value: '0' }, { text: "HIGH", value: '1' }]
                },
                pin_mode: {
                    acceptReporters: true,
                    items: [{ text: "INPUT", value: "INPUT" }, { text: "OUTPUT", value: "OUTPUT" }]
                },
                buttons: {
                    acceptReporters: true,
                    items: this.BUTTONS_MENU
                },
                gestures: {
                    acceptReporters: true,
                    items: this.GESTURES_MENU
                },
                pinState: {
                    acceptReporters: true,
                    items: this.PIN_STATE_MENU
                },
                tiltDirection: {
                    acceptReporters: true,
                    items: this.TILT_DIRECTION_MENU
                },
                tiltDirectionAny: {
                    acceptReporters: true,
                    items: this.TILT_DIRECTION_ANY_MENU
                },
                touchPins: {
                    acceptReporters: true,
                    items: ['0', '1', '2']
                }
            }
        };
    }
    getLowHigh(val){
        return val === "LOW"?0:val==="HIGH"?1:val;
    }
    digital_write(args) {
        console.log(args);

        let pin = args['PIN'];
        pin = parseInt(pin, 10);

        let value = this.getLowHigh(args['ON_OFF']);
        msg = { "command": "digital_write", "pin": pin, "value": value };
        return this._peripheral.send("digital_write", msg);

    }
    set_pin_mode(args) {
        let pin = args['PIN'];
        pin = parseInt(pin, 10);

        let value = args['PIN_MODE'];
        value = parseInt(value, 10);
        msg = { "command": "set_pin_mode", "pin": pin, "value": value };
        return this._peripheral.send("digital_write", msg);
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the button is pressed.
     */
    pin_equals(args) {

        let pin = args['PIN'];
        pin = parseInt(pin, 10);

        let valueStr = this.getLowHigh(args['ON_OFF']) + "";
        msg = { "command": "digital_read", "pin": pin };
        // msg = JSON.stringify(msg);
        return this._peripheral.send("digital_read", msg).then(currentValue => {
            return currentValue === valueStr;
        });
    }
    /**
     * Upload dev mode script
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the dev mode is uploaded.
     */
    uploadDevMode(args) {
        let dataToSend = {};
        let allblocks = this.runtime.targets[1].blocks;
        let startingBlockId = allblocks.getScripts()[0];
        let startingBlock = allblocks.getBlock(startingBlockId);
        msg = {
            "command": "upload_dev_mode",
            "data": {   }
        };

        return this._peripheral.send("upload_dev_mode", msg).then(currentValue => {
            return currentValue === valueStr;
        });
    }
    /**
     * Upload run mode script
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the dev mode is uploaded.
     */
    uploadRunMode(args) {
        let dataToSend = {};
        let allblocks = this.runtime.targets[1].blocks;
        let startingBlockId = allblocks.getScripts()[0];
        let startingBlock = allblocks.getBlock(startingBlockId);
        msg = {
            "command": "upload_run_mode",
            "data": {
                "blocks": allblocks._blocks, 
                "startingBlock":startingBlockId
             }
        };

        return this._peripheral.send("upload_run_mode", msg).then(currentValue => {
            return currentValue === valueStr;
        });
    }
}

module.exports = Scratch3ArduinoBlocks;
