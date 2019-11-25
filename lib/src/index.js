#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pkg = require("../package.json");
var commander_1 = __importDefault(require("commander"));
var add_1 = __importDefault(require("./add"));
var generate_1 = __importDefault(require("./generate"));
var init_1 = __importDefault(require("./init"));
var namesake_1 = __importDefault(require("./namesake"));
var import_1 = __importDefault(require("./import"));
commander_1.default.name('2pac').version("2pac version " + pkg.version);
commander_1.default
    .command('add')
    .description('Add a new changelog entry.')
    .action(add_1.default);
commander_1.default
    .command('generate')
    .description('Generate the CHANGELOG.md and update the version number in the package.json.')
    .action(generate_1.default);
commander_1.default
    .command('init')
    .description('Initialize the .2pacrc.json and create changelog entries folder.')
    .action(init_1.default);
commander_1.default
    .command('import')
    .description('Import an existing CHANGELOG.md file.')
    .action(import_1.default);
commander_1.default
    .command('namesake')
    .description('???')
    .action(namesake_1.default);
if (!process.argv.slice(2).length) {
    commander_1.default.help();
}
commander_1.default.parse(process.argv);
