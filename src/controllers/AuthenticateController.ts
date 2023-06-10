import { InvalidCredentialsError } from '@/errors/InvalidCredentialsError';
import { PrismaUsersRepository } from '@/repositories/prisma/PrismaUsersRepository';
import { AuthenticateService } from '@/services/AuthenticateService';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';


export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
	const authenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	});
    
	const { email, password } = authenticateBodySchema.parse(request.body);
    
	try {
		const usersRepository = new PrismaUsersRepository();
		const authenticateService = new AuthenticateService(usersRepository);

		await authenticateService.execute({ 
			email, 
			password 
		});

	} catch(err) {
		if (err instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: err.message });
		}

		throw err;
	}
        
	return reply.status(200).send();
}

