// Import path
import { extname, basename, dirname, join } from "path";

/**
 * 
 * @param {String} file The path to the file
 * @param {String} suffix The suffix to append to the file
 * @returns {String} The path to the file with the suffix
 */
export function appendToFilename(file, suffix) {
    const ext = extname(file);
    const name = basename(file, ext);
    return join(dirname(file), `${name}.${suffix}${ext}`);
}

/**
 * 
 * @param {Object} data The data to create the filename path from
 * @param {String} data.artist The artist of the song
 * @param {String} data.album The album of the song
 * @param {String} data.title The title of the song
 * @param {Number} [data.track] The track number of the song (must be > 0, it isn't checked)
 * @returns {String} The path to the file
 */
export function generateOutputFilePath(data) {
    // Set the track to have at least 1 trailing zero on the left
    data.track = data.track ? `${data.track}`.padStart(2, "0") : "";
    return join(data.artist, data.album, `${data.track} ${data.title}.mp3`.trim());
}
