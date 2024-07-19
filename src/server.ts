// src/server.ts
// Configurations de Middlewares
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
import morgan from 'morgan';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import projet from './router/projet-routers';
import student from './router/students-routers';
import users from './router/users-routers';
import cookieParser from 'cookie-parser'
import notFound from './middleware/error-not-found';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
	rateLimit({
		max: ONE_HUNDRED,
		windowMs: SIXTY,
		message: 'Trop de Requete à partir de cette adresse IP '
	})
);

app.use(cookieParser());
app.use(morgan('combined'));

//Configuration de swagger
setupSwagger(app);

app.use('/projets', projet);
app.use('/students', student);
app.use('/users', users);

// Cas des pages non trouvés;
app.use(notFound);

export default app;
