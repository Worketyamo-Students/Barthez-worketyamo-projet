import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import { PrismaClient } from "@prisma/client";
import { sendErrorResponse, treatmentError } from "../functions/throw-errors";
// import { regex } from "../core/config/env";

const prisma = new PrismaClient();

const studentControllers = {
    // Get All students
    getAllstudents : async (req: Request, res: Response) => {
        try {
            const students = await prisma.student.findMany();

            if(!students) return treatmentError(res);
            if(students.length === 0) return res.status(HttpCode.OK).json({msg: "Aucun students pour l'instant!"});
 
            res.status(HttpCode.OK).json({msg: `La liste des ${students.length} students disponibles est: `, students});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    getstudentByID : async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            
            if(!id) return res.status(HttpCode.BAD_REQUEST).json({msg: "Impossible de Trouver ce student!"});

            const student = await prisma.student.findUnique({
                where: {
                    student_id: id
                }
            })

            if(!student) return treatmentError(res);
            
            res.status(HttpCode.OK).json({msg: "le student a bien été trouvé", student});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    addNewstudent : async (req: Request, res: Response) => {
        try {
            const {age, matricule, cni, addresse, photo, phone, registration_date, tutor, school, max_School_level, status, quizzes, userID, courses, factures, exercices, certification, projet} = req.body;

            //Verification que tous les entrées sont non nul pour ceux qui ne doivent pas l'etre
            if(!age || !matricule ||!cni ||!addresse ||!phone ||!quizzes ||!courses ||!factures ||!exercices ||!certification ||!projet) return res.status(HttpCode.BAD_REQUEST).json({msg: "veilez remplir tous les champs obligatoire!"});
            
            const studentToAdd = await prisma.student.create({
                data: {
                    age,
                    matricule,
                    cni,
                    addresse,
                    photo,
                    phone,
                    registration_date,
                    tutor,
                    school,
                    max_School_level,
                    status,
                    quizzes: {
                        connect: quizzes.map((quizID: string) => ({quiz_id: quizID}))
                    },
                    isStudent: {
                        connect: { user_id: userID } 
                    },
                    courses: {
                        connect: courses.map((courseID: string) => ({course_id: courseID}))
                    },
                    factures: {
                        connect: factures.map((factureID: string) => ({facture_id: factureID}))
                    },
                    exercices: {
                        connect: exercices.map((exerciceID: string) => ({exercice_id: exerciceID}))
                    },
                    certification: {
                        connect: certification.map((certificationID: string) => ({certification_id: certificationID}))
                    },
                    projet:{
                        connect: projet.map((projetID: string) => ({projet_id: projetID}))
                    }
                }
            });

            //Faire des verifications
            
            if(!studentToAdd) return treatmentError(res);
            
            res.status(HttpCode.CREATED).json({msg: "ce student a bien ete crée", studentToAdd})
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    updateExistingstudent : async (req: Request, res: Response) => {
        try {
            const {id} = req.params            
            const {age, matricule, cni, addresse, photo, phone, registration_date, tutor, school, max_School_level, status, quizzes, userID, courses, factures, exercices, certification, projet} = req.body;
            
            //Verification que tous les entrées sont non nul pour ceux qui ne doivent pas l'etre
            if(!age || !matricule ||!cni ||!addresse ||!phone ||!quizzes ||!courses ||!factures ||!exercices ||!certification ||!projet) return res.status(HttpCode.BAD_REQUEST).json({msg: "veilez remplir tous les champs obligatoire!"});
            if(!id) return res.status(HttpCode.BAD_REQUEST).json({msg: "Impossible de Trouver ce student !"});
            
            const studentToUpdate = await prisma.student.update({
                where: {
                    student_id: id
                },

                data: {
                    age,
                    matricule,
                    cni,
                    addresse,
                    photo,
                    phone,
                    registration_date,
                    tutor,
                    school,
                    max_School_level,
                    status,
                    quizzes: {
                        connect: quizzes.map((quizID: string) => ({quiz_id: quizID}))
                    },
                    isStudent: {
                         connect: { user_id: userID } 
                    },
                    courses: {
                        connect: courses.map((courseID: string) => ({course_id: courseID}))
                    },
                    factures: {
                        connect: factures.map((factureID: string) => ({facture_id: factureID}))
                    },
                    exercices: {
                        connect: exercices.map((exerciceID: string) => ({exercice_id: exerciceID}))
                    },
                    certification: {
                        connect: certification.map((certificationID: string) => ({certification_id: certificationID}))
                    },
                    projet:{
                        connect: projet.map((projetID: string) => ({projet_id: projetID}))
                    }
                }
            });

            if(!studentToUpdate) return treatmentError(res);
            res.status(HttpCode.OK).json({msg: `Le student a bien été modifié !`});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    deleteOnestudent : async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            if(!id) return res.status(HttpCode.BAD_REQUEST).json({msg: "Impossible de Trouver ce student !"});

            const studentToDelete = await prisma.student.delete({
                where: {
                    student_id: id
                }
            })
            
            if(!studentToDelete) return treatmentError(res);
            res.status(HttpCode.OK).json({msg: "Suppression efectué avec succes"});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    deleteManystudents : async (req: Request, res: Response) => {
        try {
            const deleteManyStudents = await prisma.student.deleteMany();

            if(!deleteManyStudents) return treatmentError(res);
            res.status(HttpCode.OK).json({msg: "La liste des students est maintenant vide !"});      
        } catch (error) {
            sendErrorResponse(error, res);
        }
    }
}

export default studentControllers;
