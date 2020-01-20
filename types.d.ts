/**
 * read a file and log exceptions to debug
 *
 * @param {String} file
 * @param {Function} debugFn
 */
declare function readFile(file: string, debugFn: (...params: any[]) => any): void;

/**
 * parse file for environmental variables
 *
 * @param {String} file filepath to parse
 */
declare function parse(file: string): void;

/**
 * returns all keys in o1 that arent in o2
 *
 * @param {Object} o1
 * @param {Object} o2
 *
 * @return {Array} array of keys
 */
declare function diff(o1: any, o2: any): any[];

/**
 * clears prviously hoisted environment variables from process.env
 */
declare function clear(): void;

/**
 * This class provides methods to access the config for Adobe I/O libraries.
 */
declare class ConfigAPI {
    /**
     * Gets the value for a key in the Config.
     * If no parameters are specified, it will return all keys and values of the consolidated Config.
     *
     * @param {string} [key=''] the key to get the value from
     * @param {string} [source] 'global', 'local', or 'env'. Defaults to searching the consolidated config.
     */
    get(key?: string, source?: string): void;
    /**
     * Set the value for a key in the Config.
     *
     * @param {string} key the key to set the value to
     * @param {string} value the value to save for the key
     * @param {boolean} [local=false] Set to true to save the value in the local config. Defaults to false (save to global config).
     */
    set(key: string, value: string, local?: boolean): void;
    /**
     * Delete a key and its value in the Config.
     *
     * @param {string} key the key to delete the value from
     * @param {boolean} [local=false] Set to true to delete the value in the local config. Defaults to false (save to global config).
     */
    delete(key: string, local?: boolean): void;
    /**
     * Reload the Config from all the config file(s)
     */
    reload(): void;
    /**
     * Pipe data from stdin.
     *
     * @function
     * @return {Promise<string>}
     */
    getPipedData(): Promise<string>;
    /**
     * Hoists variables in the ./.env file to process.env
     *
     * @function
     * @param {Object} the dotenv object
     */
    dotenv(the: any): void;
}

/**
 * Support for mkdir -p.
 *
 * @param {String} dir the folder to create
 */
declare function mkdirp(dir: string): void;

/**
 * Get property from object with case insensitivity.
 *
 * @param {Object} obj
 * @param {String} key
 */
declare function getProp(obj: any, key: string): void;

/**
 * Get a value in an object by dot notation.
 *
 * @param {String} key
 * @param {Object} obj
 *
 * @return {Object}
 */
declare function getValue(key: string, obj: any): any;

/**
 * Set a value by dot notation.
 *
 * @param {String} key
 * @param {String} value
 * @param {Object} [obj]
 *
 * @return {Object}
 */
declare function setValue(key: string, value: string, obj?: any): any;

/**
 * Deep merge a collection of objs returning a new object.
 *
 * @param  {Array} objs array of objects
 *
 * @return {Object}
 */
declare function merge(...objs: any[][]): any;

/**
 * Remove empty leaves from an object.
 *
 * @param {Object} obj
 *
 * @return {Object}
 */
declare function shake(obj: any): any;

/**
 * Deserialise from a file.
 *
 * @param {String} file
 *
 * @return {Object}
 */
declare function loadFile(file: string): any;

/**
 * yaml serialise an object to a file.
 *
 * @param {String} file
 * @param {Object} obj
 * @param {String} format
 */
declare function saveFile(file: string, obj: any, format: string): void;

