import { Request, Response, NextFunction } from "express";
import { badRequest, sendErrorResponse, treatmentError } from "../functions/throw-errors";
import { PrismaClient } from "@prisma/client";
import { HttpCode, ROLE } from "../core/constants";

const prisma = new PrismaClient();

const userRole = {
    Admin: async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { idA } = req.params;
            if( !idA) return treatmentError(res);
    
            // On recherche l'utilisateur en question
            const user = await prisma.user.findUnique({
                where: {
                    user_id : idA
                }
            });
            if(!user) return badRequest(res, "Utilisateur non trouvé");
    
            // On verifie le role de l'utilisateur trouvé
            if(user.role !== ROLE[1] && user.role !== ROLE[0]) return res.status(HttpCode.UNAUTHORIZED).json({msg: "vous n'etes pas authorisé a effectué cette action"});
             
            next();
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    SuperAdmin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { idA } = req.params;
            if( !idA) return treatmentError(res);
    
            // On recherche l'utilisateur en question
            const user = await prisma.user.findUnique({
                where: {
                    user_id: idA
                }
            });
            if(!user) return badRequest(res, "Utilisateur non trouvé");
    
            // On verifie le role de l'utilisateur trouvé
            if(user.role !== ROLE[0]) return res.status(HttpCode.UNAUTHORIZED).json({msg: "vous n'etes pas authorisé a effectué cette action"});
        
            next();
        } catch (error) {
            sendErrorResponse(error, res);
        }
    }
}


export default userRole;