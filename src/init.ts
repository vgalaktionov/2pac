import { writeFileSync, existsSync, PathLike, mkdirSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface Config {
    entriesPath: PathLike;
}

export const configPath = join(process.cwd(), '.2pacrc.json');
export const entriesPath = join(process.cwd(), '.changelogentries');

const writeConfig = (path: PathLike, config: Config) => {
    console.log('Writing configuration file (.2pacrc.json).');
    writeFileSync(path, JSON.stringify(config, null, 4));
};

export const checkInit = () => {
    const config = require(join(process.cwd(), '.2pacrc.json'));
    if (!existsSync(configPath) || !existsSync(config.entriesPath)) {
        console.log(chalk.red('No config and/or entries directory found; run `2pac init` first!'));
        process.exit(1);
    }
};

export default async function init() {
    console.log('2pac init \n');
    if (!existsSync(join(process.cwd(), 'package.json'))) {
        console.log(
            chalk.red(
                'This command must be run in the project root (where package.json is located)!',
            ),
        );
        return;
    }

    const config = await inquirer.prompt([
        {
            type: 'input',
            name: 'entriesPath',
            message: 'Where should individual entries be stored?',
            default: entriesPath,
        },
    ]);

    if (!existsSync(configPath)) {
        writeConfig(configPath, config);
    } else {
        const { overwrite } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: 'Existing configuration file found. Overwrite?',
            },
        ]);
        if (overwrite) {
            writeConfig(configPath, config);
        }
    }

    if (!existsSync(config.entriesPath)) {
        mkdirSync(config.entriesPath);
    }
}
