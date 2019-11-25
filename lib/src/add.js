"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var init_1 = require("./init");
var inquirer_1 = __importDefault(require("inquirer"));
var chalk_1 = __importDefault(require("chalk"));
var config_1 = require("./config");
var addLines = function (entry, input, section) {
    entry += "### " + section + "\n";
    entry += input
        .split('\n')
        .filter(function (l) { return l.length > 0; })
        .map(function (l) { return "  - " + l + "\n"; })
        .join('');
    entry += '\n';
    return entry;
};
var generateEntry = function (answers) {
    var entry = '';
    if (answers.added) {
        entry = addLines(entry, answers.added, 'Added');
    }
    if (answers.changed) {
        entry = addLines(entry, answers.changed, 'Changed');
    }
    if (answers.fixed) {
        entry = addLines(entry, answers.fixed, 'Fixed');
    }
    var name = Date.now() + "-" + answers.versionType;
    return { entry: entry, name: name };
};
function add() {
    return __awaiter(this, void 0, void 0, function () {
        var answers, _a, entry, name;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('2pac add \n');
                    init_1.checkInit();
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'list',
                                choices: ['major', 'minor', 'patch'],
                                name: 'versionType',
                                message: 'What kind of version is this?',
                            },
                            { type: 'confirm', name: 'hasAdded', message: 'New things added?' },
                            {
                                when: function (_a) {
                                    var hasAdded = _a.hasAdded;
                                    return hasAdded === true;
                                },
                                type: 'editor',
                                name: 'added',
                                message: 'Enter the additions made, separated by newlines.',
                            },
                            { type: 'confirm', name: 'hasChanged', message: 'Existing things changed?' },
                            {
                                when: function (_a) {
                                    var hasChanged = _a.hasChanged;
                                    return hasChanged === true;
                                },
                                type: 'editor',
                                name: 'changed',
                                message: 'Enter the changes made, separated by newlines.',
                            },
                            { type: 'confirm', name: 'hasFixed', message: 'Problems fixed?' },
                            {
                                when: function (_a) {
                                    var hasFixed = _a.hasFixed;
                                    return hasFixed === true;
                                },
                                type: 'editor',
                                name: 'fixed',
                                message: 'Enter the fixes made, separated by newlines.',
                            },
                        ])];
                case 1:
                    answers = _b.sent();
                    if (!answers.added && !answers.changed && !answers.fixed) {
                        console.log(chalk_1.default.red('\nNo changelog provided!'));
                        return [2 /*return*/];
                    }
                    _a = generateEntry(answers), entry = _a.entry, name = _a.name;
                    fs_1.writeFileSync(path_1.join(config_1.config.entriesPath, name), entry.trim() + '\n');
                    console.log(chalk_1.default.cyan("\nWritten changelog entry " + name + " !"));
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = add;
