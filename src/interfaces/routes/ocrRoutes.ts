import express from "express";
import multer from "multer";
import { OCRcontroller } from "../controllers/ocrcontroller";
const ocrroute = express.Router();

const orcController = new OCRcontroller();

const upload = multer({ dest: "uploads/" });

ocrroute.post(
  "/ocr",
  upload.fields([{ name: "frontImage" }, { name: "backImage" }]),
  (req, res, next) => {
    orcController._ocrpost(req, res, next);
  }
);

export { ocrroute };
