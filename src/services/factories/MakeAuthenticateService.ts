import { PrismaUsersRepository } from '@/repositories/prisma/PrismaUsersRepository';
import { AuthenticateService } from '../AuthenticateService';

export function makeAuthenticateService() {

	const authenticateRepository = new PrismaUsersRepository();
	const authenticateService = new AuthenticateService(authenticateRepository);

	return authenticateService;
}