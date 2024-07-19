import { Request, Response } from "express";
import { HttpCode, MAX_ATTEMPTS, ROLE } from "../core/constants";
import { PrismaClient} from "@prisma/client";
import { badRequest, sendErrorResponse, treatmentError } from "../functions/throw-errors";
import regex from "../core/config/all-regex"
import hashText from '../functions/hash-text'
import generateOTP from '../functions/generate-otp'
import sendmail from '../functions/sendMail'
import bcrypt from 'bcrypt'
import UserToken from "../functions/jwt";

const prisma = new PrismaClient();

const usersControllers = {
    getAllUsers : async (req: Request, res: Response) => {
        try {
            const users = await prisma.user.findMany();

            if(!users) return treatmentError(res);
            if(users.length === 0) return res.status(HttpCode.OK).json({msg: "Pas encore d'utilisateurs enregistré"})
            
            users.forEach(user => {
                user.otp = "";
                user.password = "";
            });
            res.status(HttpCode.OK).json({msg: `La liste des ${users.length} utilisateurs inscrits est: `, users});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    getUserByID : async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            if(!id) return res.status(HttpCode.BAD_REQUEST).json({msg: "mauvaise requete, verifier l'identifiant"});

            const user = await prisma.user.findUnique({
                where: {
                    user_id: id
                }
            });

            if(!user) return treatmentError(res);

            user.otp = "";
            user.password = "";
            res.status(HttpCode.OK).json({msg: "L'element a bien ete trouvé: ", user});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    addNewUser : async (req: Request, res: Response) => {
        try {
          const {name, email, password, role} = req.body;
          
            // Verifions que tout les champs sont bien saisis
            if(!name || !email || !password) return badRequest(res, 'Veillez entrer toutes les informations')
          
            //Verifions la validité et l'unicité des informations saisis
            const userAlreadyExist = await prisma.user.findFirst({
                where: {
                    email   
                }
            });
            if(userAlreadyExist) return badRequest(res, "cet email est dejà utilisé !");

            if(!regex.REGEX_NOM.test(name)) return badRequest(res, "Entrer un nom valide !");
            if(!regex.REGEX_EMAIL.test(email)) return badRequest(res, "Entrer une addresse email valide !")
            if(!regex.REGEX_PASSWORD.test(password)) return badRequest(res, "Entrer un mot de passe valide !");
            
            if (role && !ROLE .includes(role)) return badRequest(res, "Veuillez entrer un rôle valide !");
    
            const isWeakPassword = password.includes(email) || password.includes(name) || password.toLowerCase().includes("password");
            if (isWeakPassword) return badRequest(res, "Le mot de passe n'est pas robuste !");

            const passwordHash = await hashText(password);

            const codeOtp = generateOTP();
            const  otpHash = hashText(codeOtp);
            const maxDate = new Date(Date.now() + 10 * 60 * 1000 )

            //Ajout des informations dans la base de données
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: passwordHash,
                    role,
                    otp: otpHash,
                    otp_expirateDate: maxDate
                }
            });
            if(!newUser) return treatmentError(res);

            // Envoi de l'Email a l'utilisateur
            const text =`
                            <h2>Bonjour ${newUser.name}</h2>
                            <p>Nous avons reçu votre demande à rejoindre la communauté <a href="#">worketyamo</a></p>.
                            <p>votre code de validation est:</p>
                            <h2>${codeOtp}</h2><hr/>
                            <p>Ce code expirera dans 10 minutes.</p>
                            <b>Merci</b>
                        `;
            sendmail(email, text);

            newUser.otp ="";
            newUser.password = "";
            res.status(HttpCode.CREATED).json({msg: `l'utilisateur ${newUser.name} a bien été créee:`, newUser});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    updateExistingUser : async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            const {name, email, password, role} = req.body;
            if(!id) return badRequest(res, "mauvaise requete, verifier l'identifiant");
            // Verifions que tout les champs sont bien saisis
            if(!name || !email || !password) return badRequest(res, 'Veillez entrer toutes les informations');
          
            //Verifions la validité et l'unicité des informations saisis
            if(!regex.REGEX_NOM.test(name)) return badRequest(res, "Entrer un nom valide !");
            if(!regex.REGEX_EMAIL.test(email)) return badRequest(res, "Entrer une addresse email valide !")
            if(!regex.REGEX_PASSWORD.test(password)) return badRequest(res, "Entrer un mot de passe valide !");

            const ROLE = ["SuperAdmin", "Admin", "Teacher", "Student", "User"];
            if (role && !ROLE.includes(role)) return badRequest(res, "Veuillez entrer un rôle valide !");
    
            const isWeakPassword = password.includes(email) || password.includes(name) || password.toLowerCase().includes("password");
            if (isWeakPassword) return badRequest(res, "Le mot de passe n'est pas robuste !");

            const passwordHash = await hashText(password);
                
            //Ajout des informations dans la base de données

            const updateUser = await prisma.user.update({
                where: {
                    user_id: id
                },

                data: {
                    name,
                    email,
                    password: passwordHash,
                    role
                }
            });

            if(!updateUser) return treatmentError(res);

            updateUser.otp = "";
            updateUser.password = "";
            res.status(HttpCode.CREATED).json({msg: `l'utilisateur ${updateUser.name} a bien été modifiée:`, updateUser});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    deleteOneUser : async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            if(!id) return badRequest(res, "mauvaise requete, verifier l'identifiant");
                        
            const deleteUser = await prisma.user.delete({
                where: {
                    user_id: id
                }
            });
            if(!deleteUser) return treatmentError(res);
            res.status(HttpCode.OK).json({msg: `l'utilisateur ${deleteUser.name} a bien été supprimé !`});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    deleteAllUsers : async (req: Request, res: Response) => {
        try {
            const deleteUsers = await prisma.user.deleteMany();

            if(!deleteUsers) return treatmentError(res);

            res.status(HttpCode.OK).json({msg: `Tous les utilisateurs ont bien été supprimé`});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    verifyOTP: async(req: Request, res: Response) => {
        try {
            const {email, otp} = req.body;

            if(!email || !otp) return badRequest(res, "Veillez remplir tous les champs !")

            // verifier  que l'utilisateur entrer existe
            const user = await prisma.user.findFirst({
                where: {
                    email
                }
            });
            if(!user) return badRequest(res, "L'utilisateur n'a pas été trouvé !"); 
    
            // verification de l'OTP entrer par l'utilisateur avant tout traitement 
            if(!regex.REGEX_OTP.test(otp)) return badRequest(res, "OTP non valide"); 
    
            //comparer la date d'entrer avec la date d'expiration
            const date_now = new Date();
            if(date_now > user.otp_expirateDate) return badRequest(res, "Le code OTP a expiré !");

            // On compare le nombre de tentaites incoreectes de l'utilisateur
            if(user.attempts && user.attempts >= MAX_ATTEMPTS) return badRequest(res, "Trop de tentatives incorrectes, veillez reessayez plus tard !");

            // Verification de la validité de l'otp 
            if(!bcrypt.compareSync(otp.toString(), user.otp)){
                const updateUser = await prisma.user.update({
                    where: {
                        email
                    },
                    data: {
                        attempts: (user.attempts || 0) + 1
                    }
                })
                if(!updateUser) return badRequest(res, "Echec de la mise à jour des tentatives !");

                return badRequest(res, "OTP incorrect");
            }
            
            await prisma.user.update({
                where: {
                    email
                },
                data: {
                    otp: undefined,
                    otp_expirateDate: undefined,
                    attempts: null
                }
            });

            res.status(HttpCode.OK).json({msg: 'OTP vérifié avec succès !'})
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    loginUser: async(req: Request, res: Response) => {
        try {
            const {email, password} = req.body;

            // Verifions que tout les champs sont bien saisis
            if(!email || !password) return badRequest(res, 'Veillez entrer toutes les informations');
          
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });
            if(!user) return badRequest(res, "L'utilisateur n'existe pas!");

            if(!bcrypt.compareSync(password, user.password)) return badRequest(res, "Mot de passe incorrect !");

            const accessToken = UserToken.createAccessToken(user);
            const RefreshToken = UserToken.createRefreshToken(user);

            res.setHeader('Authorization', `Bearer ${accessToken}`);
            const cookieOption = {
                secure: process.env.NODE_ENV === 'production',
                HttpOnly: true,
                // sameSite: 'strict'
            };
            res.cookie("refreshToken", RefreshToken, cookieOption);

            res.status(HttpCode.OK).json({msg: `Utilistaeur connecté: ${accessToken}`});
        } catch (error) {
            sendErrorResponse(error, res);
        }
    },

    refreshToken: async (req: Request, res: Response) => {
        try {
            const token = req.cookies.refreshToken;

            if(!token) return badRequest(res, "Aucun jeton touvé!");

            const userData = UserToken.verifyRefreshToken(token);
            if(!userData) return badRequest(res, 'Token invalide ou a expiré !');

            const user = await prisma.user.findUnique({
                where: {
                    user_id: userData.user_id
                }
            })
            if(!user) return badRequest(res, "L'utilisateur n'existe pas !");
            
            const newAccessToken = UserToken.createAccessToken(user);
            const newRefreshToken = UserToken.createRefreshToken(user);

            res.setHeader('Authorization', `Bearer ${newAccessToken}`);
            const cookieOption = {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                // sameSite: 'strict'
            }
            res.cookie("refreshToken", newRefreshToken, cookieOption);
        } catch (error) {
            sendErrorResponse(error, res);
        }
    }
}

export default usersControllers;