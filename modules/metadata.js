// Import ffmetadata
import ffmetadataPKG from "ffmetadata";
const ffmetadata = ffmetadataPKG;

// Import promisify
import { promisify } from "util";

/**
 * Add metadata to a file
 * 
 * @param {String} path The path to the file
 * @param {Object} data The data to add to the file
 * @param {Object} options The options to use for ffmetadata
 * @param {Array<String>} options.attachments The file path to the cover art
 * @param {Boolean} options.id3v2.3 Whether use id3v2.3
 * @returns {Promise<String>} The path to the file
 */
export default async function addMetadata(path, data, options) {
    await promisify(ffmetadata.write)(path, data, options);
    return path;
}
