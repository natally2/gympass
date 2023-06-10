import { InMemoryUsersRepository } from '@/repositories/in-memory/InMemoryUsersRepository';
import { describe, expect, it } from 'vitest';
import { AuthenticateService } from './AuthenticateService';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from '@/errors/InvalidCredentialsError';

describe('Athenticate Service', () => {
    
	
	it('should be able to authenticate', async() => {
		const inMemoryUsersRepository = new InMemoryUsersRepository();
		const authenticateService = new AuthenticateService(inMemoryUsersRepository);


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
		const inMemoryUsersRepository = new InMemoryUsersRepository();
		const authenticateService = new AuthenticateService(inMemoryUsersRepository);
        
		await expect(() => 
			authenticateService.execute({
				email: 'teste@gmail.com',
				password: '123456'
			})).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('should not be able to authenticate with wrong password', async() => {
		const inMemoryUsersRepository = new InMemoryUsersRepository();
		const authenticateService = new AuthenticateService(inMemoryUsersRepository);

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