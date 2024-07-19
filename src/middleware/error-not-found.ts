import { Request, Response, NextFunction } from "express";
import { sendErrorResponse } from "../functions/throw-errors";
import { HttpCode } from "../core/constants";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    try {
        if(res.statusCode === HttpCode.NOT_FOUND) {
            return res.status(HttpCode.NOT_FOUND).json({msg: "Page non trouvé !"});
        }
        
        next();
    } catch (error) {
        sendErrorResponse(error, res);
    }
}

export default notFound;