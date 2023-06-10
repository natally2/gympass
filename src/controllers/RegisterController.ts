import { UserAlreadyExistsError } from '@/errors/UserAlreadyExistsError';
import { PrismaUsersRepository } from '@/repositories/prisma/PrismaUsersRepository';
import { CreateUsersService } from '@/services/CreateUsersService';
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
		const createUsersService = new CreateUsersService(usersRepository);

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

