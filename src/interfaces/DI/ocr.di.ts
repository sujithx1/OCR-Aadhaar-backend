import { OCRUseCase } from "../../useCase/ocruseCase";
import { OCRcontroller } from "../controllers/ocrcontroller";

const ocruseCase=new OCRUseCase()
export const orcController = new OCRcontroller(ocruseCase);
