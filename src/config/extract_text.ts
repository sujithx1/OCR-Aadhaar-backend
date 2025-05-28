import Tesseract from "tesseract.js";

  export const extractText = async (path: string) =>
      (await Tesseract.recognize(path, 'eng')).data.text;