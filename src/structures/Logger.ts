import chalk from 'chalk';

export default class Logger {
    private log(msg: string) {
        console.log(msg);
    }

    private logBold(msg: string) {
        this.log(chalk.bold(msg));
    }

    info(msg: string) {
        this.logBold(chalk.white(msg));
    }

    error(msg: Error | string) {
        this.logBold(chalk.red(msg instanceof Error ? msg.message : msg));
    }
}
