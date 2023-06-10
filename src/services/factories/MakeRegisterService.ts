import { PrismaUsersRepository } from '@/repositories/prisma/PrismaUsersRepository';
import { CreateUsersService } from '../CreateUsersService';

export function makeRegisterService() {

	const usersRepository = new PrismaUsersRepository();
	const createUsersService = new CreateUsersService(usersRepository);

	return createUsersService;
}