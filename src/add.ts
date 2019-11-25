import { join } from 'path';
import { writeFileSync } from 'fs';
import { checkInit } from './init';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { config } from './config';

export type VersionType = 'major' | 'minor' | 'patch';

interface AddAnswers {
    versionType: VersionType;
    hasAdded: boolean;
    hasChanged: boolean;
    hasFixed: boolean;
    added?: string;
    changed?: string;
    fixed?: string;
}

const addLines = (entry: string, input: string, section: 'Added' | 'Changed' | 'Fixed') => {
    entry += `### ${section}\n`;
    entry += input
        .split('\n')
        .filter(l => l.length > 0)
        .map(l => `  - ${l}\n`)
        .join('');
    entry += '\n';
    return entry;
};

const generateEntry = (answers: AddAnswers) => {
    let entry = '';

    if (answers.added) {
        entry = addLines(entry, answers.added, 'Added');
    }
    if (answers.changed) {
        entry = addLines(entry, answers.changed, 'Changed');
    }
    if (answers.fixed) {
        entry = addLines(entry, answers.fixed, 'Fixed');
    }
    const name = `${Date.now()}-${answers.versionType}`;

    return { entry, name };
};

export default async function add() {
    console.log('2pac add \n');

    checkInit();

    const answers: AddAnswers = await inquirer.prompt([
        {
            type: 'list',
            choices: ['major', 'minor', 'patch'],
            name: 'versionType',
            message: 'What kind of version is this?',
        },
        { type: 'confirm', name: 'hasAdded', message: 'New things added?' },
        {
            when: ({ hasAdded }) => hasAdded === true,
            type: 'editor',
            name: 'added',
            message: 'Enter the additions made, separated by newlines.',
        },
        { type: 'confirm', name: 'hasChanged', message: 'Existing things changed?' },
        {
            when: ({ hasChanged }) => hasChanged === true,
            type: 'editor',
            name: 'changed',
            message: 'Enter the changes made, separated by newlines.',
        },
        { type: 'confirm', name: 'hasFixed', message: 'Problems fixed?' },
        {
            when: ({ hasFixed }) => hasFixed === true,
            type: 'editor',
            name: 'fixed',
            message: 'Enter the fixes made, separated by newlines.',
        },
    ]);

    if (!answers.added && !answers.changed && !answers.fixed) {
        console.log(chalk.red('\nNo changelog provided!'));
        return;
    }

    const { entry, name } = generateEntry(answers);

    writeFileSync(join(config.entriesPath, name), entry.trim());

    console.log(chalk.cyan(`\nWritten changelog entry ${name} !`));
}
