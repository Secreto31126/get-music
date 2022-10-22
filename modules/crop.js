// @ts-nocheck

// Import exec
import { exec } from "child_process";

// Import image-size
import { imageSize } from "image-size";

// Import promisify
import { promisify } from "util";

// Import custom modules
import { appendToFilename } from "./rename.js";

/**
 * Crop the thumbnail in order to get 1:1 (square)
 * 
 * @async
 * @param {String} image Location of the tmp image
 * @returns {Promise<String>} The path to the 1:1 image
 */
export default async function crop(image) {
    const size = await promisify(imageSize)(image);
    if (size.width === size.height) return image;

    const ffmpeg = process.env.FFMPEG_PATH;
    const output = appendToFilename(image, "cropped");

    /**
     * Set the width and the height to the image height with ffmpeg
     * (dim.height:dim.height == 1:1 aspect-ratio == square)
     * 
     * To crop the image ffmpeg also needs coordinates (x, y, from top left of the file)
     * Y is 0 for obvious reasons, but X is a funny story
     * The square (1:1) starts at X = (width - height) / 2
     */
    const X = (size.width - size.height) / 2;

    const command = `"${ffmpeg}" -hide_banner -i "${image}" -vf "crop=${size.height}:${size.height}:${X}:0" "${output}"`;
    await promisify(exec)(command);
    
    return output;
}
