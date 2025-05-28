"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractText = void 0;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const extractText = async (path) => (await tesseract_js_1.default.recognize(path, 'eng')).data.text;
exports.extractText = extractText;
