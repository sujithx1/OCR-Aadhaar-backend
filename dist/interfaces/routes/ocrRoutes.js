"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrroute = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const ocrcontroller_1 = require("../controllers/ocrcontroller");
const ocrroute = express_1.default.Router();
exports.ocrroute = ocrroute;
const orcController = new ocrcontroller_1.OCRcontroller();
const upload = (0, multer_1.default)({ dest: "uploads/" });
ocrroute.post("/ocr", upload.fields([{ name: "frontImage" }, { name: "backImage" }]), (req, res, next) => {
    orcController._ocrpost(req, res, next);
});
