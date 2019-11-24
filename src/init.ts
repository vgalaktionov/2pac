import { writeFileSync, existsSync, PathLike, mkdirSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

const defaultConfig = {};
const configPath = join(process.cwd(), '.2pacrc.json');
const entriesPath = join(process.cwd(), '.2pacentries');

const writeConfig = (path: PathLike) => {
    console.log('Writing configuration file (.2pacrc.json).');
    writeFileSync(path, JSON.stringify(defaultConfig, null, 4));
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

    if (!existsSync(configPath)) {
        writeConfig(configPath);
    } else {
        const { overwrite } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: 'Existing configuration file found. Overwrite?',
            },
        ]);
        if (overwrite) {
            writeConfig(configPath);
        }
    }

    if (!existsSync(entriesPath)) {
        mkdirSync(entriesPath);
    }
}
