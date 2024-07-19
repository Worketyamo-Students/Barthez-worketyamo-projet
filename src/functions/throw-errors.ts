import { HttpCode } from "../core/constants";
import { Response } from "express";

export const sendErrorResponse = (error: unknown, res: Response) => {
    console.error(error);
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({msg: "Erreur de serveur !"});
}

export const treatmentError = (res:Response) =>{
    return res.status(HttpCode.BAD_REQUEST).json({msg: "erreur lors du traitement !"})
}

export const badRequest = (res: Response, msg: string) => {
    return res.status(HttpCode.BAD_REQUEST).json({msg});
}