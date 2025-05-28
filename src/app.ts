import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser";
import { ocrroute } from "./interfaces/routes/ocrRoutes";
import { errorHandler } from "./config/errorhandlers";

const app=express()
 

  
const corsOptions={
    origin: process.env.CLIENT_URL, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.use('/uploads', express.static('uploads'));
app.use('/api', ocrroute);

app.use(express.json()) 
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'))

app.use((err: Error, req: Request, res: Response, next: NextFunction) =>
  {
    
    errorHandler(err, req, res, next)
  }  
);   
export {app}
