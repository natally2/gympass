import { expect, describe, it } from 'vitest';
import { compare } from 'bcryptjs';
import { CreateUsersService } from './CreateUsersService';
import { InMemoryUsersRepository } from '@/repositories/in-memory/InMemoryUsersRepository';
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error';

describe('Create User Service', () => {

	it('should create a user', async() => {
		const inMemoryUsersRepository = new InMemoryUsersRepository();
		const createUserService = new CreateUsersService(inMemoryUsersRepository);

		const userData = {
			name: 'TEST',
			email: 'teste@gmail.com',
			password: '12345656'
		};

		const { user } = await createUserService.execute(userData);

		expect(user.id).toEqual(expect.any(String));
	});

	it('should hash user password upom registration', async() => {
		const inMemoryUsersRepository = new InMemoryUsersRepository();
		const createUserService = new CreateUsersService(inMemoryUsersRepository);

		const userData = {
			name: 'TEST',
			email: 'teste@gmail.com',
			password: '12345656'
		};

		const { user } = await createUserService.execute(userData);

		const isPasswordCorrectlyHashed = await compare(
			userData.password, 
			user.password_hash
		);
        
		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it('should not be able to register user with same email twice', async() => {
		const inMemoryUsersRepository = new InMemoryUsersRepository();
		const createUserService = new CreateUsersService(inMemoryUsersRepository);

		const email = 'teste@gmail.com';

		await createUserService.execute({
			name: 'TEST',
			email,
			password: '12345656'
		});


		await expect(async () => 
			createUserService.execute({
				name: 'TEST',
				email,
				password: '12345656'
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	}); 
    
});