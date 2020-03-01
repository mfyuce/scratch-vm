const Scratch3ArduinoBlocks = require('../scratch3_arduino');

/**
 * Scratch 3.0 blocks to interact with a Arduino peripheral.
 */
class Scratch3ArduinoSimulatorBlocks extends Scratch3ArduinoBlocks{

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME() {
        return 'pinoosimulator';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return 'pinoosimulator';
    } 

    /**
     * Construct a set of Arduino blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor(runtime) {
        super(runtime, Scratch3ArduinoSimulatorBlocks.EXTENSION_ID); 

        // this.runtime.registerPeripheralExtension(Scratch3ArduinoSimulatorBlocks.EXTENSION_ID, this);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        let ret = super.getInfo();
        ret.id = Scratch3ArduinoSimulatorBlocks.EXTENSION_ID;
        ret.name = Scratch3ArduinoSimulatorBlocks.EXTENSION_NAME; 
        return ret;  
    }   
}

module.exports = Scratch3ArduinoSimulatorBlocks;
