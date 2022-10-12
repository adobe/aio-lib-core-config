/**
 * read a file and log exceptions to debug
 */
declare function readFile(file: string, debugFn: (...params: any[]) => any): void;

/**
 * parse file for environmental variables
 * @param file - filepath to parse
 */
declare function parse(file: string): void;

/**
 * parse file for environmental variables and log debug message for duplicate definitions
 * @param file - filepath to parse
 */
declare function checkForDuplicates(file: string): void;

/**
 * returns all keys in o1 that arent in o2
 * @returns array of keys
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
     * @param [key = ''] - the key to get the value from
     * @param [source] - 'global', 'local', or 'env'. Defaults to searching the consolidated config.
     */
    get(key?: string, source?: string): void;
    /**
     * Set the value for a key in the Config.
     * @param key - the key to set the value to
     * @param value - the value to save for the key
     * @param [local = false] - Set to true to save the value in the local config. Defaults to false (save to global config).
     */
    set(key: string, value: string, local?: boolean): void;
    /**
     * Delete a key and its value in the Config.
     * @param key - the key to delete the value from
     * @param [local = false] - Set to true to delete the value in the local config. Defaults to false (save to global config).
     */
    delete(key: string, local?: boolean): void;
    /**
     * Reload the Config from all the config file(s)
     */
    reload(): void;
    /**
     * Pipe data from stdin.
     */
    getPipedData(): Promise<string>;
    /**
     * Hoists variables in the ./.env file to process.env
     * @param the - dotenv object
     */
    dotenv(the: any): void;
}

/**
 * Support for mkdir -p.
 * @param dir - the folder to create
 */
declare function mkdirp(dir: string): void;

/**
 * Get property from object with case insensitivity.
 */
declare function getProp(obj: any, key: string): void;

/**
 * Get a value in an object by dot notation.
 */
declare function getValue(key: string, obj: any): any;

/**
 * Set a value by dot notation.
 */
declare function setValue(key: string, value: string, obj?: any): any;

/**
 * Deep merge a collection of objs returning a new object.
 * @param objs - array of objects
 */
declare function merge(...objs: any[][]): any;

/**
 * Remove empty leaves from an object.
 */
declare function shake(obj: any): any;

/**
 * Deserialise from a file.
 */
declare function loadFile(file: string): any;

/**
 * yaml serialise an object to a file.
 */
declare function saveFile(file: string, obj: any, format: string): void;

