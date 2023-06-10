import { UserAlreadyExistsError } from '@/errors/user-already-exists-error';
import { IUsersRepository } from '@/repositories/IUsersRepository';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

interface CreateUserResponse {
	user: User;
}

export class CreateUsersService {

	constructor(private usersRepository: IUsersRepository) {}

	async execute({ name, email, password }: RegisterUseCaseRequest): Promise<CreateUserResponse> {
        
		const password_hash = await hash(password, 6);
    
		const userWithSameEmail = await this.usersRepository.findByEmail(email);
		
		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}
    
		const user = await this.usersRepository.create({
			name, 
			email, 
			password_hash
		});

		return { 
			user, 
		};
	}
}
