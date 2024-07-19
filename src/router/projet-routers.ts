import { Router } from "express";
import projetControllers from "../controllers/projet-controllers";

const projet = Router();

// Create a New Projet
projet.post('/projets', projetControllers.addNewProjet);

// Get All Projets
projet.get('/projets', projetControllers.getAllProjets);

// Get projet by ID
projet.get('/projets/:id', projetControllers.getProjetByID);

//Update Projets
projet.put('/projets/:id', projetControllers.updateExistingProjet);

//Delete Projet by ID
projet.delete('/projets/:id', projetControllers.deleteOneProjet);

// Delete All projets
projet.delete('/projets', projetControllers.deleteManyProjets);

export default projet;