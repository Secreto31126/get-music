// Import fs
import fs from 'fs-extra'; // CommonJS compatibility

// Import path
import { dirname } from 'path';

/**
 * Save a stream to a location asynchronously
 * 
 * @param {String} filename Where to save the file
 * @param {ReadableStream} stream The stream to save
 * @returns {Promise<String>} The path to the saved file
 */
export default async function download(filename, stream) {
    // Check if file exists async :)
    if (await fs.pathExists(filename)) {
        return filename;
    }

    await fs.mkdirs(dirname(filename));

    const file = fs.createWriteStream(filename);
    stream.pipe(file);
    
    return new Promise((fulfill, reject) => {
        stream.on('finish', () => fulfill(filename));
        stream.on('error', reject);
    });
}
