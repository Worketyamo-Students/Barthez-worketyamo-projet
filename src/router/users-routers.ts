import { Router } from "express";
import usersControllers from "../controllers/users-controllers";
import userRole from "../middleware/roleUser";

const users = Router();

// GET ROUTE

// Afficher tous les utilisateurs 
users.get('/', usersControllers.getAllUsers);
//Afficher l'utilisateur en fonction de l'ID
users.get('/:id', usersControllers.getUserByID);

// POST ROUTE
//Ajouter un utilisateur
users.post('/', usersControllers.addNewUser);
// Authentification d'un utilisateur
users.post('/login', usersControllers.loginUser);
// Verifier l'OTP de l'utilisateur
users.post('/verify-otp', usersControllers.verifyOTP);
// verify token of each user
users.post('/refresh-token',usersControllers.refreshToken)

// PUT ROUTE
//Modifier un utilisateur dejà existant 
users.put('/:id', usersControllers.updateExistingUser);

//DELETE ROUTE
//Supprimer un utilisateur
users.delete('/admin/:idA/:id', userRole.Admin, usersControllers.deleteOneUser);
//Supprimer tous les utilisateurs
users.delete('/admin/:idA', userRole.SuperAdmin, usersControllers.deleteAllUsers);

export default users;