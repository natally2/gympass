import { expect, describe, it, beforeEach } from 'vitest';
import { compare } from 'bcryptjs';
import { CreateUsersService } from './CreateUsersService';
import { InMemoryUsersRepository } from '@/repositories/in-memory/InMemoryUsersRepository';
import { UserAlreadyExistsError } from '@/errors/UserAlreadyExistsError';

describe('Create User Service', () => {

	let inMemoryUsersRepository: InMemoryUsersRepository;
	let createUserService: CreateUsersService;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		createUserService = new CreateUsersService(inMemoryUsersRepository);
	});

	it('should be able to create a user', async() => {
	
		const userData = {
			name: 'TEST',
			email: 'teste@gmail.com',
			password: '12345656'
		};

		const { user } = await createUserService.execute(userData);

		expect(user.id).toEqual(expect.any(String));
	});

	it('should hash user password upom registration', async() => {
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