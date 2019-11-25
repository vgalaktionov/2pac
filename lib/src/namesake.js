"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var open_1 = __importDefault(require("open"));
var chalk_1 = __importDefault(require("chalk"));
function namesake() {
    console.log('2pac namesake\n');
    console.log(chalk_1.default.cyan('Playing Changes by 2Pac on YouTube, enjoy!'));
    open_1.default('https://www.youtube.com/watch?v=eXvBjCO19QY');
}
exports.default = namesake;
