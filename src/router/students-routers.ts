import { Router } from "express";
import studentControllers from "../controllers/students-controllers";

const student = Router();

// Create a New student
student.post('/students', studentControllers.addNewstudent);

// Get All students
student.get('/students', studentControllers.getAllstudents);

// Get student by ID
student.get('/students/:id', studentControllers.getstudentByID);

//Update students
student.put('/students/:id', studentControllers.updateExistingstudent);

//Delete student by ID
student.delete('/students/:id', studentControllers.deleteOnestudent);

// Delete All students
student.delete('/students', studentControllers.deleteManystudents);

export default student;