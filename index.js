// Use dotenv to load environment variables from a .env file
import "dotenv/config.js";

// Import minimist
import minimist from "minimist";

// Import path
import { basename } from "path";

// Import custom modules
import getSong from "./modules/song.js";
import moveSong from "./modules/move.js";
import videoOrPlaylist from "./modules/type.js";
import getPlaylist from "./modules/playlist.js";

// Read arguments from the command line
const args = minimist(process.argv.slice(2));
const url = args._[0];

// If user wants help
if (args.help) {
    console.log(`
        Usage: node ./index.js [url] [parameters]

        --date [string]: Set a date for the songs
        --album [string]: Set an album name for the songs
        --artist [string]: Set an artist name for the songs
        --album_artist [string]: Set an album artist name for the songs, defaults to artist
        --publisher [string]: Set a publisher for the songs (won't be setted if not provided)
        --disc [number]: Set a disc number for the songs (won't be setted if not provided)
        --genre [string]: Set a genre for the songs (won't be setted if not provided)
        --title [string]: Set a title for the song (ignored in playlists)
        --index [number]: Set an index number for the song (ignored in playlist)
        -o[number]: Ommit songs with index [number] (only available for playlists). Example: "[url] -o5 -o6"

        --help: Prints this guide
    `.trim());
    process.exit(0);
}

// Check if the url is valid youtube url
if (!url) {
    console.log("Please provide a valid Youtube Music url");
    process.exit(1);
}

// Check if the url is a playlist or a video, returns null if invalid
const type = videoOrPlaylist(url);

if (!type) {
    console.log("Please provide a valid Youtube Music url, either a song or an album/public playlist");
    process.exit(1);
}

let output;

if (type === "playlist") {
    if (args.title) delete args.title;
    if (args.index) delete args.index;

    const songs = await Promise.all(await getPlaylist(url, args));

    output = Promise.all(
        songs.map(async song => {
            try {
                return await moveSong(song, process.env.MUSIC, args.overwrite);
            } catch (err) {
                console.error(basename(song), "file probably already exists (it can be overwritten if you include the --overwrite flag)");
                if (args.debug) console.error(err);
                return null;
            }
        })
    );
}

if (type === "video") {
    const song = await getSong(url, args);

    try {
        output = moveSong(song, process.env.MUSIC, args.overwrite);
    } catch (err) {
        console.error("File probably already exists (it can be overwritten if you include the --overwrite flag)");
        if (args.debug) console.error(err);
        process.exit(1);
    }
}

console.log(await output);
