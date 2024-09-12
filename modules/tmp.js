// Import promisify
import { promisify } from "util";

// Import tmp
import { dir, setGracefulCleanup } from "tmp";
setGracefulCleanup();

/**
 * Create a temporary folder asynchronously
 * 
 * @param {String} prefix The prefix for the tmp folder
 * @returns {Promise<String>} The path to the tmp folder
 */
export default function createTmpFolder(prefix = "get-music") {
    // @ts-ignore
    return promisify(dir)({ prefix, unsafeCleanup: true });
}
