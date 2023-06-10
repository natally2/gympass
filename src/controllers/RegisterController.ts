import { UserAlreadyExistsError } from '@/errors/user-already-exists-error';
import { PrismaUsersRepository } from '@/repositories/prisma/PrismaUserRepository';
import { CreateUserService } from '@/services/CreateUserService';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';


export async function registerController(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	});
    
	const { name, email, password } = registerBodySchema.parse(request.body);
    
	try {
		const usersRepository = new PrismaUsersRepository();
		const createUsersService = new CreateUserService(usersRepository);

		await createUsersService.execute({ 
			name, 
			email, 
			password 
		});
	} catch(err) {
		if (err instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: err.message });
		}

		throw err;
	}
        
	return reply.status(201).send();
}

