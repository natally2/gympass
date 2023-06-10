import { InvalidCredentialsError } from '@/errors/InvalidCredentialsError';
import { IUsersRepository } from '@/repositories/IUsersRepository';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';

interface AuthenticateUserServiceRequest {
    email: string;
    password: string;
}

interface AuthenticateUserServiceResponse {
    user: User;
}

export class AuthenticateService {
	constructor(private usersRepository: IUsersRepository) {}

	async execute({ email, password }: AuthenticateUserServiceRequest): Promise<AuthenticateUserServiceResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new InvalidCredentialsError();
		}

		const doesPasswordMatches = await compare(password, user.password_hash);

		if (!doesPasswordMatches) {
			throw new InvalidCredentialsError();
		}

		return {
			user,
		};
	}
}