import { Command as Commander } from 'commander';
import fs from 'fs';
import path from 'path';

const program = new Commander();

fs.readdirSync(path.resolve(__dirname, 'commands')).forEach(file => {
    const { default: Command } = require(path.resolve(__dirname, 'commands', file));
    const command = new Command();

    program
        .command(`${command.name} ${command.parsedArgs}`)
        .description(command.description)
        .action((...args) => command.run(...args));
});

program.version('0.1').parse(process.argv);
