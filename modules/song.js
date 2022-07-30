// Import ytdl-core
import ytdl from "ytdl-core";

// Import path
import { dirname, join } from "path";

// Import node-fetch
import fetch from "node-fetch";

// Import fs
import { mkdirs, move } from "fs-extra";

// Import custom modules
import crop from "./crop.js";
import download from "./download.js";
import createTmpFolder from "./tmp.js";
import parseVideoData from "./data.js";
import addMetadata from "./metadata.js";
import correctBitrate from "./bitrate.js";
import { generateOutputFilePath } from "./rename.js";

/**
 * Download a single song
 * 
 * @async
 * @param {String} url The url of the video
 * @param {Object} params The parameters to use that will modify the output
 * @param {String} [tmpDir] The path to the tmp directory, used for downloading playlists, if not provided, a new one will be created
 * @param {String} [songId] The id of the song, used for downloading playlists
 * @returns {Promise<String>} The full path to the output file (tmp/author/album/file.mp3)
 */
async function getSong(url, params, tmpDir, id = "") {
    // Check if video exists with ytdl (will throw if not)
    const video = await ytdl.getBasicInfo(url);
    
    tmpDir = tmpDir ?? await createTmpFolder();

    const data = parseVideoData(video, params);
    const output = join(tmpDir, generateOutputFilePath(data));

    const tmpSongPath = join(tmpDir, id, "song.mp3");
    const tmpThumbnailPath = join(tmpDir, "thumbnail.jpg");

    const songStream = ytdl(url, { format: "mp3" });
    const songPromise = download(tmpSongPath, songStream);

    const bitratePromise = correctBitrate(await songPromise);

    const thumbnailStream = (await fetch(video.videoDetails.thumbnails.at(-1).url)).body;
    const thumbnailPromise = download(tmpThumbnailPath, thumbnailStream);

    const cropPromise = crop(await thumbnailPromise);
    
    const options = {
        attachments: [ await cropPromise ],
        "id3v2.3": true
    };

    const metadataPromise = addMetadata(await bitratePromise, data, options);

    await mkdirs(dirname(output));
    await move(await metadataPromise, output);

    return output;
}

export default getSong;
