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
 * @param {string} url The url of the video
 * @param {Object} params The parameters to use that will modify the output
 * @param {string} [tmpDir] The path to the tmp directory, used for downloading playlists, if not provided, a new one will be created
 * @param {string} id The id of the song, used for downloading playlists
 * @returns {Promise<{ song: string; image: string }>} The full path to the song file (/tmp/author/album/file.mp3) and the image file (/tmp/author/album/file.png)
 */
export default async function getSong(url, params, tmpDir, id = "") {
    // Check if video exists with ytdl (will throw if not)
    const video = await ytdl.getBasicInfo(url);
    
    tmpDir = tmpDir ?? await createTmpFolder();

    const data = parseVideoData(video, params);
    const path = join(tmpDir, generateOutputFilePath(data));
    const song = mkdirs(dirname(path)).then(() => path);

    const tmpSongPath = join(tmpDir, id, "song.mp3");
    const tmpThumbnailPath = join(tmpDir, "thumbnail.jpg");

    const songStream = ytdl(url, { quality: "highestaudio" });
    const songPromise = download(tmpSongPath, songStream);

    const bitratePromise = correctBitrate(await songPromise);

    const thumbnailStream = (await fetch(video.videoDetails.thumbnails.at(-1).url)).body;
    const thumbnailPromise = download(tmpThumbnailPath, thumbnailStream);

    const image = crop(await thumbnailPromise);
    
    const options = {
        attachments: [ await image ],
        "id3v2.3": true
    };

    const metadataPromise = addMetadata(await bitratePromise, data, options);

    await move(await metadataPromise, await song);

    return { song: await song, image: await image };
}
