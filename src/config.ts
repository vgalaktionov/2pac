import { join } from 'path';

export interface Config {
    entriesPath: string;
    firstVersion?: string;
}
export const config: Config = require(join(process.cwd(), '.2pacrc.json'));
