#!/usr/bin/env node

import pkg = require('../package.json');
import program from 'commander';
import add from './add';
import generate from './generate';
import init from './init';
import namesake from './namesake';
import importExisting from './import';

program.name('2pac').version(`2pac version ${pkg.version}`);

program
    .command('add')
    .description('Add a new changelog entry.')
    .action(add);

program
    .command('generate')
    .description('Generate the CHANGELOG.md and update the version number in the package.json.')
    .action(generate);

program
    .command('init')
    .description('Initialize the .2pacrc.json and create changelog entries folder.')
    .action(init);

program
    .command('import')
    .description('Import an existing CHANGELOG.md file.')
    .action(importExisting);

program
    .command('namesake')
    .description('???')
    .action(namesake);

if (!process.argv.slice(2).length) {
    program.help();
}

program.parse(process.argv);
