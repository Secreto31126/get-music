// Import path
import { basename, dirname, join } from "path";

// Import fs-extra
import { move } from 'fs-extra';

/**
 * Move a song file to a new location asynchronously
 * 
 * @async
 * @param {String} file The path to the file
 * @param {String} musicFolder The path to the music folder
 * @param {Boolean} overwrite Whether to overwrite the file if it exists (default: false)
 * @returns {Promise<String>} The path to the file
 */
export default async function moveSong(file, musicFolder, overwrite = false) {
    const destination = join(musicFolder, basename(dirname(dirname(file))), basename(dirname(file)), basename(file));
    await move(file, destination, { overwrite });
    return destination;
}
