import Command from '../structures/Command';
import Player from '../structures/Player';
import resolvePlaylist from 'ytpl';
import { mpvNotFoundError, ytdlNotFoundError } from '../constants';

export default class extends Command {
    constructor() {
        super('yt', 'stream a youtube video from its url', [{ name: 'url', required: true }]);
    }

    async run(url: string) {
        if (!url.startsWith('http')) url = `https://${url}`;

        const isYoutubeVideo = this.isYoutubeVideoUrl(url);
        const isYoutubePlaylist = this.isYoutubePlaylistUrl(url);

        if (!isYoutubeVideo && !isYoutubePlaylist) {
            return this.logger.error('That is not a valid YouTube URL!');
        } else {
            try {
                const player = new Player(this.logger);

                if (isYoutubeVideo) {
                    try {
                        await player.mpv.start();
                        await player.mpv.load(url);
                    } catch (error) {
                        console.error(error);
                        this.logger.error('There was an error while fetching your video!');
                    }
                }

                if (isYoutubePlaylist) {
                    try {
                        let { items: videos } = await resolvePlaylist(
                            url.match(/^.*(?:youtu.be\/|list=)([^#\&\?]*).*/)[1]
                        );

                        // todo: load more than just the first 100 when the user reaches the end of that amount

                        await player.mpv.start();
                        await player.mpv.load(videos[0].shortUrl);
                        videos.splice(0, 1);

                        videos.forEach(async video => {
                            await player.mpv.append(video.shortUrl);
                        });
                    } catch (error) {
                        console.error(error);
                        this.logger.error('There was an error while fetching your playlist!');
                    }
                }
            } catch (error) {
                switch (error.message) {
                    case 'mpv_not_found':
                        this.logger.error(mpvNotFoundError);
                        break;
                    case 'ytdl_not_found':
                        this.logger.error(ytdlNotFoundError);
                        break;
                }
            }
        }
    }

    /**
     * Figure out if a URL is a valid YouTube video URL
     */
    private isYoutubeVideoUrl(url: string) {
        return url.match(
            /(?:http(?:s)?:\/\/)(?:www\.)?(?:(?:youtube\.com\/watch\?v=)|(?:youtu\.be\/))[0-9A-Za-z]+/
        )
            ? true
            : false;
    }

    /**
     * Figure out if a URL is a valid YouTube playlist URL
     */
    private isYoutubePlaylistUrl(url: String) {
        return url.match(/^.*(?:youtu.be\/|list=)(?:[^#\&\?]*).*/) ? true : false;
    }
}
