import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import { PrismaClient } from "@prisma/client";
import { sendErrorResponse, treatmentError } from "../functions/throw-errors";
// import { regex } from "../core/config/env";

const prisma = new PrismaClient();

const projetControllers = {
    // Get All Projets
    getAllProjets : async (req: Request, res: Response) => {
        try {
            const projets = await prisma.projet.findMany();

            if(!projets) return treatmentError(res);
            if(projets.length === 0) return res.status(HttpCode.OK).json({msg: "Aucun projets pour l'instant !"});
 
            res.status(HttpCode.OK).json({msg: `La liste des ${projets.length} projets disponibles est: `, projets});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    getProjetByID : async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            
            if(!id) return res.status(HttpCode.BAD_REQUEST).json({msg: "Impossible de Trouver ce projet !"});

            const projet = await prisma.projet.findUnique({
                where: {
                    projet_id: id
                }
            })

            if(!projet) return treatmentError(res);
            
            res.status(HttpCode.OK).json({msg: "le projet a bien été trouvé", projet});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    addNewProjet : async (req: Request, res: Response) => {
        try {
            const {title, description, student} = req.body;

            //Verification que tous les entrées sont non nul pour ceux qui ne doivent pas l'etre
            if(!title || !student) return res.status(HttpCode.BAD_REQUEST).json({msg: "Les champs title et student sont obligatoire!"});
            
            const projetToAdd = await prisma.projet.create({
                data: {
                    title,
                    description,
                    student: {
                        connect: student.map((studentID: string) => ({ student_id: studentID })),
                    },
                }
            });
            //verifier que
            if(!projetToAdd) return treatmentError(res);
            res.status(HttpCode.CREATED).json({msg: "le projet " + projetToAdd.title + " a bien ete crée", projetToAdd})
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    updateExistingProjet : async (req: Request, res: Response) => {
        try {
            const {id} = req.params            
            const {title, description, student} = req.body
            if(!id) return res.status(HttpCode.BAD_REQUEST).json({msg: "Impossible de Trouver ce projet !"});
            
            const projetToUpdate = await prisma.projet.update({
                where: {
                    projet_id: id
                },

                data: {
                    title,
                    description,
                    student
                }
            })

            if(!projetToUpdate) return treatmentError(res);
            res.status(HttpCode.OK).json({msg: `Le projet a bien été modifié !`});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    deleteOneProjet : async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            if(!id) return res.status(HttpCode.BAD_REQUEST).json({msg: "Impossible de Trouver ce projet !"});

            const projetToDelete = await prisma.projet.delete({
                where: {
                    projet_id: id
                }
            })
            
            if(!projetToDelete) return treatmentError(res);
            res.status(HttpCode.OK).json({msg: "Suppression efectué avec succes"});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    deleteManyProjets : async (req: Request, res: Response) => {
        try {
            const deleteManyProjets = await prisma.projet.deleteMany();

            if(!deleteManyProjets) return treatmentError(res);
            res.status(HttpCode.OK).json({msg: "La liste des projets est maintenant vide !"});      
        } catch (error) {
            sendErrorResponse(error, res);
        }
    }
}

export default projetControllers;
