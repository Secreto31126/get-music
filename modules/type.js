// Import ytdl-core
import ytdl from "@distube/ytdl-core";

// Import ytpl
import ytpl from "ytpl";

/**
 * @param {String} url The url to validate
 */
export default function videoOrPlaylist(url) {
    if (ytdl.validateURL(url)) return "video";
    if (ytpl.validateID(url)) return "playlist";
    return null;
}
