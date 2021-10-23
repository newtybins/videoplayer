import Logger from './Logger';

interface Argument {
    name: string;
    required?: boolean;
}

export default abstract class {
    logger = new Logger();
    name: string;
    description: string;
    private args: Argument[];

    constructor(name: string, description: string, args: Argument[]) {
        this.name = name;
        this.description = description;
        this.args = args;
    }

    get parsedArgs() {
        return this.args.map(a => {
            const required = a.required ?? false;
            return `${required ? '<' : '['}${a.name}${required ? '>' : ']'}`;
        });
    }

    abstract run(...args: any[]): any;
}
