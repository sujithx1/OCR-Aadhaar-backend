import express from "express";
import multer from "multer";
import { orcController } from "../DI/ocr.di";
const ocrroute = express.Router();


const upload = multer({ dest: "uploads/" });

ocrroute.post(
  "/ocr",
  upload.fields([{ name: "frontImage" }, { name: "backImage" }]),
  (req, res, next) => {
    orcController._ocrpost(req, res, next);
  }
);

export { ocrroute };
