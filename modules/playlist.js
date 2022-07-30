// Import ytpl
import ytpl from "ytpl";

// Import node-fetch
import fetch from "node-fetch";

// Import path
import { join } from "path";

// Import custom modules
import getSong from "./song.js";
import download from "./download.js";
import createTmpFolder from "./tmp.js";

/**
 * Download a playlist (multiple songs)
 * 
 * @async
 * @param {String} url The url of the playlist
 * @param {Object} params The parameters to use that will modify the output
 * @returns {Promise<Array<Promise<String>>>} An array of full path to the outputs files (tmp/author/album/file.mp3)
 */
export default async function getPlaylist(url, params) {
    const playlist = await ytpl(url, { limit: Infinity });

    const tmpDir = await createTmpFolder();
    const tmpThumbnailPath = join(tmpDir, "thumbnail.jpg");
    
    const thumbnailStream = (await fetch(playlist.bestThumbnail.url)).body;
    await download(tmpThumbnailPath, thumbnailStream);

    const output = [];
    playlist.items.forEach(async song => {
        if (params.o?.includes(song.index)) return;
        const file = getSong(song.url, { ...song, ...params }, tmpDir, song.id);
        output.push(file);
    });
    
    return output;
}
