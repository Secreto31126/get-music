// Import promisify
import { promisify } from "util";

// Import exec
import { exec } from "child_process";

// Import custom modules
import { appendToFilename } from "./rename.js";

/**
 * Correct the bitrate
 * 
 * @async
 * @param {String} file Input file path
 * @returns {Promise<String>} The path to the corrected file
 */
export default async function correctBitrate(file) {
    const ffmpeg = process.env.FFMPEG_PATH;
    const output = appendToFilename(file, "bitrate");
    
    // -id3v2_version 3
    const command = `"${ffmpeg}" -hide_banner -i "${file}" -b:a 148k "${output}"`;
    await promisify(exec)(command);

    return output;
}
