import MPV from 'node-mpv';
import path from 'path';
import Logger from './Logger';
import fs from 'fs';
import { sync as commandExists } from 'command-exists';

export default class Player {
    mpv: MPV;
    private logger: Logger;

    constructor(logger: Logger) {
        const potentialMpv = path.resolve(process.cwd(), 'bin', 'mpv', 'mpv.exe');
        const potentialYtdl = path.resolve(process.cwd(), 'bin', 'ytdl.exe');
        const mpvBinaryExists = fs.existsSync(potentialMpv);
        const ytdlBinaryExists = fs.existsSync(potentialYtdl);

        this.mpv = new MPV(
            {
                binary: mpvBinaryExists ? potentialMpv : null
            },
            ytdlBinaryExists ? [`--script-opts=ytdl_hook-ytdl_path=${potentialYtdl}`] : null
        );

        if (!mpvBinaryExists && !commandExists('mpv')) throw new Error('mpv_not_found');
        if (!ytdlBinaryExists && !commandExists('youtube-dl')) throw new Error('ytdl_not_found');

        this.logger = logger;

        this.mpv.on('status', s => {
            if (
                s.property === 'media-title' &&
                s.value &&
                !s.value.toString().match(/watch\?v=.+/)
            ) {
                this.logger.info(`Started playing ${s.value}`);
            }
        });

        this.mpv.on('stopped', () => this.mpv.quit());
    }
}
