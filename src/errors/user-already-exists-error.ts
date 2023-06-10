
export class UserAlreadyExistsError extends Error {
	constructor() {
		super('Email already exists!'); //super is the class Error's constructor
	}
}