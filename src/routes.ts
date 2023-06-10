import { FastifyInstance } from 'fastify';
import { registerController } from './controllers/RegisterController';
import { authenticateController } from './controllers/AuthenticateController';



export async function appRoutes(app: FastifyInstance){
	app.post('/users', registerController);
	app.post('/sessions', authenticateController);
}