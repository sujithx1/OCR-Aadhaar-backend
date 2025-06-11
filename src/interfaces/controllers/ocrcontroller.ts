import { NextFunction, Request, Response } from "express";
import { AppError } from "../../config/apperror";
import { ErrorCodes, StatusCode, StatusMessage } from "../../config/errorcodes";
import { OCRUseCase } from "../../useCase/ocruseCase";
 



export class OCRcontroller {
  constructor(private ocrPostuseCase:OCRUseCase) {
    
  }
  async _ocrpost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files) {
        return next(new AppError(ErrorCodes.Image_missing, 401));
      }

      const frontFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["frontImage"]?.[0];
      const backFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["backImage"]?.[0];

      if (!frontFile || !backFile)
        return res.status(400).send("Both images required");

      const data=await this.ocrPostuseCase.execute(frontFile,backFile)
      res
        .status(StatusCode.OK)
        .json({ success: true, data, message:StatusMessage.parsing_ok});
    } catch (error) {
      return next(error);
    }
  }
}
