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
var fs_1 = require("fs");
var path_1 = require("path");
var chalk_1 = __importDefault(require("chalk"));
var inquirer_1 = __importDefault(require("inquirer"));
var import_1 = __importDefault(require("./import"));
exports.configPath = path_1.join(process.cwd(), '.2pacrc.json');
exports.entriesPath = path_1.join(process.cwd(), '.changelogentries');
var writeConfig = function (path, config) {
    console.log(chalk_1.default.cyan('Writing configuration file (.2pacrc.json).'));
    fs_1.writeFileSync(path, JSON.stringify(config, null, 4));
};
exports.checkInit = function () {
    var config = require(path_1.join(process.cwd(), '.2pacrc.json'));
    if (!fs_1.existsSync(exports.configPath) || !fs_1.existsSync(config.entriesPath)) {
        console.log(chalk_1.default.red('No config and/or entries directory found; run `2pac init` first!'));
        process.exit(1);
    }
};
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var config, overwrite, doImport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('2pac init \n');
                    if (!fs_1.existsSync(path_1.join(process.cwd(), 'package.json'))) {
                        console.log(chalk_1.default.red('This command must be run in the project root (where package.json is located)!'));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'input',
                                name: 'entriesPath',
                                message: 'Where should individual entries be stored?',
                                default: exports.entriesPath,
                            },
                            {
                                type: 'input',
                                name: 'firstVersion',
                                message: 'What is the first version in the changelog?',
                                default: '0.1.0',
                                validate: function (firstVersion) { return /\d\.\d\.\d/.test(firstVersion); },
                            },
                        ])];
                case 1:
                    config = _a.sent();
                    if (!!fs_1.existsSync(exports.configPath)) return [3 /*break*/, 2];
                    writeConfig(exports.configPath, config);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            type: 'confirm',
                            name: 'overwrite',
                            message: 'Existing configuration file found. Overwrite?',
                        },
                    ])];
                case 3:
                    overwrite = (_a.sent()).overwrite;
                    if (overwrite) {
                        writeConfig(exports.configPath, config);
                    }
                    _a.label = 4;
                case 4:
                    if (!fs_1.existsSync(config.entriesPath)) {
                        console.log(chalk_1.default.cyan("Created directory " + config.entriesPath + " ."));
                        fs_1.mkdirSync(config.entriesPath);
                    }
                    if (!fs_1.existsSync(path_1.join(process.cwd(), 'CHANGELOG.md'))) return [3 /*break*/, 6];
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'confirm',
                                name: 'doImport',
                                message: 'Existing CHANGELOG.md file found. Import?',
                            },
                        ])];
                case 5:
                    doImport = (_a.sent()).doImport;
                    if (doImport) {
                        import_1.default();
                    }
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.default = init;
