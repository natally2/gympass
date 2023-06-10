import { InMemoryUsersRepository } from '@/repositories/in-memory/InMemoryUsersRepository';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateService } from './AuthenticateService';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from '@/errors/InvalidCredentialsError';

describe('Athenticate Service', () => {
	let inMemoryUsersRepository: InMemoryUsersRepository;
	let authenticateService: AuthenticateService;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		authenticateService = new AuthenticateService(inMemoryUsersRepository);
	});
	
	it('should be able to authenticate', async() => {
		await inMemoryUsersRepository.create({
			name: 'TEST',
			email: 'teste@gmail.com',
			password_hash: await hash('123456', 6)
            
		});

		const { user } = await authenticateService.execute({
			email: 'teste@gmail.com',
			password: '123456'
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should not be able to authenticate with wrong email', async() => {        
		await expect(() => 
			authenticateService.execute({
				email: 'teste@gmail.com',
				password: '123456'
			})).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('should not be able to authenticate with wrong password', async() => {
		await inMemoryUsersRepository.create({
			name: 'TEST',
			email: 'teste@gmail.com',
			password_hash: await hash('123456', 6)
            
		});
        
		await expect(() => 
			authenticateService.execute({
				email: 'teste@gmail.com',
				password: '123'
			})).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

    

});