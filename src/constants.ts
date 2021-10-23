import { stripIndents } from 'common-tags';

export const version = '0.1';

// todo: replace with more verbose errors
export const mpvNotFoundError = stripIndents`
	An installation of MPV could not be detected on your computer!
`;

export const ytdlNotFoundError = stripIndents`
	An installation of YTDL could not be detected on your computer!
`;
