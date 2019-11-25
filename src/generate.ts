import { join } from 'path';
import { VersionType } from './add';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { config } from './config';
import { formatISO } from 'date-fns';
import chalk from 'chalk';

interface Entry {
    timestamp: Date;
    versionType: VersionType;
    entry: string;
}

const generateChangelog = (filenames: string[]) => {
    const entries: Entry[] = filenames.map(f => {
        const matches = f.match(/^(?<timestampRaw>\d+)-(?<versionType>major|minor|patch)$/);
        if (matches == null) {
            throw new Error(`Invalid filename: ${f} !`);
        }
        const groups = matches.groups!;
        const timestamp = new Date(parseInt(groups.timestampRaw, 10));
        const versionType = groups.versionType as VersionType;
        const entry = readFileSync(join(config.entriesPath, f)).toString();
        return { timestamp, versionType, entry };
    });

    entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const changelogEntries = [];
    const version = {
        major: 0,
        minor: 0,
        patch: 0,
    };

    for (const { timestamp, versionType, entry } of entries) {
        switch (versionType) {
            case 'patch':
                version.patch++;
                break;
            case 'minor':
                version.patch = 0;
                version.minor++;
                break;
            case 'major':
                version.patch = 0;
                version.minor = 0;
                version.major++;
                break;
        }

        const versionString = `${version.major}.${version.minor}.${version.patch}`;

        const changelogEntry = `## [${versionString}] - ${formatISO(timestamp, {
            representation: 'date',
        })}\n\n${entry}`;

        changelogEntries.push(changelogEntry);
    }

    const changelog = `THIS CHANGELOG IS AUTO-GENERATED BY [2pac](https://github.com/vgalaktionov/2pac), DO NOT EDIT!

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

${changelogEntries.reverse().join('')}`;
    return { changelog, version: `${version.major}.${version.minor}.${version.patch}` };
};

export default function generate() {
    console.log('2pac generate');

    try {
        const filenames = readdirSync(config.entriesPath);
        const { changelog, version } = generateChangelog(filenames);

        writeFileSync(join(process.cwd(), 'CHANGELOG.md'), changelog);
        console.log(chalk.cyan('Written CHANGELOG.md!'));

        const pkg = require(join(process.cwd(), 'package.json'));
        pkg.version = version;
        writeFileSync(join(process.cwd(), 'package.json'), JSON.stringify(pkg, undefined, 4));
        console.log(chalk.cyan('Updated package.json!'));
    } catch (error) {
        console.log(chalk.red(error.message));
    }
}
