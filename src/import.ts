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

const defaultEntry = {
    versionString: '',
    timestamp: new Date(),
    entry: '',
};

export default function importExisting() {
    console.log('2pac import\n');
    try {
        const existing = readFileSync(join(process.cwd(), 'CHANGELOG.md')).toString();
        const contents = existing.match(contentsPattern)!.groups!.contents;

        const entries = contents
            .split('\n')
            .reduce(
                (acc: Entry[], line: string) => {
                    const match = line.match(headerPattern);

                    if (match != null) {
                        const { versionString, dateString } = match.groups!;
                        acc.push({ versionString, timestamp: parseISO(dateString), entry: '' });
                    } else {
                        acc[acc.length - 1].entry += `${line}\n`;
                    }

                    return acc;
                },
                [{ ...defaultEntry }],
            )
            .filter(e => e.entry.trim().length > 0)
            .reverse();

        const firstVersion = entries[0].versionString;
        firstVersion.slice;
        writeFileSync(
            join(process.cwd(), '.2pacrc.json'),
            JSON.stringify({ ...config(), firstVersion }, undefined, 4),
        );
        console.log(chalk.cyan(`Set first changelog version to ${firstVersion} .`));

        entries.forEach(({ versionString, timestamp, entry }, index) => {
            const previous = index === 0 ? firstVersion : entries[index - 1].versionString;

            let [previousMajor, previousMinor, previousPatch] = previous
                .split('.')
                .map(v => parseInt(v, 10));

            // We always consider the first entry to be a minor, and need to subtract one to get the final version correct
            if (index === 0) {
                previousMinor--;
            }

            const [major, minor, patch] = versionString.split('.').map(v => parseInt(v, 10));

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
