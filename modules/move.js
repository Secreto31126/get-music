// Import path
import { basename, dirname, extname, join } from "path";

// Import fs-extra
import { move } from 'fs-extra';

/**
 * Move a song file to a new location asynchronously
 * 
 * @async
 * @param {string} file The path to the file
 * @param {string} musicFolder The path to the music folder
 * @param {Boolean} overwrite Whether to overwrite the file if it exists (default: false)
 * @returns {Promise<string>} The path to the file
 */
export async function moveSong(file, musicFolder, overwrite = false) {
    const destination = join(musicFolder, basename(dirname(dirname(file))), basename(dirname(file)), basename(file));
    await move(file, destination, { overwrite });
    return destination;
}

/**
 * Move a image file to the same location as a song asynchronously
 * 
 * @async
 * @param {string} file The path to the file
 * @param {string} song The song the image belongs to
 * @param {string} musicFolder The path to the music folder
 * @param {Boolean} overwrite Whether to overwrite the file if it exists (default: false)
 * @returns {Promise<string>} The path to the file
 */
export async function moveImage(file, song, musicFolder, overwrite = false) {
    const destination = join(musicFolder, basename(dirname(dirname(song))), basename(dirname(song)), ".cover" + extname(file));
    await move(file, destination, { overwrite });
    return destination;
}
