import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import chalk from 'chalk';

export interface Config {
    entriesPath: string;
    firstVersion?: string;
}
export const configPath = join(process.cwd(), '.2pacrc.json');

export const config = (): Config => JSON.parse(readFileSync(configPath).toString());

export const checkInit = () => {
    if (!existsSync(configPath) || !existsSync(join(process.cwd(), config().entriesPath))) {
        console.log(chalk.red('No config and/or entries directory found; run `2pac init` first!'));
        process.exit(1);
    }
};
