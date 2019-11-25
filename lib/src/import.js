"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var chalk_1 = __importDefault(require("chalk"));
var date_fns_1 = require("date-fns");
var config_1 = require("./config");
var headerPattern = /\[(?<versionString>\d\.\d\.\d)\]\s-\s(?<dateString>\d{4}-\d{2}-\d{2})/;
var contentsPattern = /## (?<contents>\[.*)$/s;
function importExisting() {
    console.log('2pac import\n');
    try {
        var existing = fs_1.readFileSync(path_1.join(process.cwd(), 'CHANGELOG.md')).toString();
        var contents = existing.match(contentsPattern).groups.contents;
        var entries_1 = [];
        var current_1 = {
            versionString: '',
            timestamp: new Date(),
            entry: '',
        };
        contents.split('\n').forEach(function (line, index) {
            var match = line.match(headerPattern);
            if (match != null) {
                if (index > 1) {
                    entries_1.push(current_1);
                }
                var _a = match.groups, versionString = _a.versionString, dateString = _a.dateString;
                current_1.versionString = versionString;
                current_1.timestamp = date_fns_1.parseISO(dateString);
                current_1.entry = '';
            }
            else {
                current_1.entry += line + "\n";
            }
        });
        if (current_1.versionString.length > 0 && current_1.entry.length > 0) {
            entries_1.push(current_1);
        }
        entries_1 = entries_1.reverse();
        var firstVersion_1 = entries_1[0].versionString;
        config_1.config.firstVersion = firstVersion_1;
        fs_1.writeFileSync(path_1.join(process.cwd(), '.2pacrc.json'), JSON.stringify(config_1.config, undefined, 4));
        console.log(chalk_1.default.cyan("Set first changelog version to " + firstVersion_1 + " ."));
        entries_1.forEach(function (_a, index) {
            var versionString = _a.versionString, timestamp = _a.timestamp, entry = _a.entry;
            var previous = index === 0 ? firstVersion_1 : entries_1[index - 1].versionString;
            var _b = previous.split('.'), previousMajor = _b[0], previousMinor = _b[1], previousPatch = _b[2];
            var _c = versionString.split('.'), major = _c[0], minor = _c[1], patch = _c[2];
            var versionType = 'minor';
            if (major > previousMajor) {
                versionType = 'major';
            }
            else if (patch > previousPatch) {
                versionType = 'patch';
            }
            else if (minor > previousMinor) {
                versionType = 'minor';
            }
            var ms = timestamp.getTime();
            while (fs_1.existsSync(path_1.join(config_1.config.entriesPath, ms + "-" + versionType))) {
                ms++;
            }
            var filename = path_1.join(config_1.config.entriesPath, ms + "-" + versionType);
            fs_1.writeFileSync(filename, entry.trim());
            console.log(chalk_1.default.cyan("Written entry " + filename + " ."));
        });
        console.log(chalk_1.default.cyan('Imported existing CHANGELOG.md .'));
    }
    catch (error) {
        console.log(chalk_1.default.red(error.message));
    }
}
exports.default = importExisting;
