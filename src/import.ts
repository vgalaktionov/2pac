import { VersionType } from './add';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import chalk from 'chalk';
import { parseISO } from 'date-fns';
import { config } from './config';

const headerPattern = /\[(?<versionString>\d\.\d\.\d)\]\s-\s(?<dateString>\d{4}-\d{2}-\d{2})/;
const contentsPattern = /## (?<contents>\[.*)$/s;

interface Entry {
    versionString: string;
    timestamp: Date;
    entry: string;
}

export default function importExisting() {
    console.log('2pac import\n');
    try {
        const existing = readFileSync(join(process.cwd(), 'CHANGELOG.md')).toString();
        const contents = existing.match(contentsPattern)!.groups!.contents;

        let entries: Entry[] = [];
        const current = {
            versionString: '',
            timestamp: new Date(),
            entry: '',
        };
        contents.split('\n').forEach((line, index) => {
            const match = line.match(headerPattern);

            if (match != null) {
                if (index > 1) {
                    entries.push(current);
                }
                const { versionString, dateString } = match.groups!;
                current.versionString = versionString;
                current.timestamp = parseISO(dateString);
                current.entry = '';
            } else {
                current.entry += `${line}\n`;
            }
        });
        if (current.versionString.length > 0 && current.entry.length > 0) {
            entries.push(current);
        }

        entries = entries.reverse();

        const firstVersion = entries[0].versionString;
        writeFileSync(
            join(process.cwd(), '.2pacrc.json'),
            JSON.stringify({ ...config(), firstVersion }, undefined, 4),
        );
        console.log(chalk.cyan(`Set first changelog version to ${firstVersion} .`));

        entries.forEach(({ versionString, timestamp, entry }, index) => {
            const previous = index === 0 ? firstVersion : entries[index - 1].versionString;

            const [previousMajor, previousMinor, previousPatch] = previous.split('.');
            const [major, minor, patch] = versionString.split('.');

            let versionType: VersionType = 'minor';
            if (major > previousMajor) {
                versionType = 'major';
            } else if (patch > previousPatch) {
                versionType = 'patch';
            } else if (minor > previousMinor) {
                versionType = 'minor';
            }

            let ms = timestamp.getTime();
            while (existsSync(join(process.cwd(), config().entriesPath, `${ms}-${versionType}`))) {
                ms++;
            }

            const filename = join(process.cwd(), config().entriesPath, `${ms}-${versionType}`);

            writeFileSync(filename, entry.trim());
            console.log(chalk.cyan(`Written entry ${filename} .`));
        });

        console.log(chalk.cyan('Imported existing CHANGELOG.md .'));
    } catch (error) {
        console.log(chalk.red(error.message));
    }
}
