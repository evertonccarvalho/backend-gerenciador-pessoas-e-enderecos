import bcrypt from 'bcrypt';

export interface IUser {
	id?: string;
	name?: string | null;
	email: string;
	address?: string | null;
}

export interface IRegisterUser {
	name: string;
	email: string;
	password: string;
}

export class UserRegisterDTO {
	name: string;
	email: string;
	password: string;

	constructor(user: IRegisterUser) {
		this.name = user.name;
		this.email = user.email;
		this.password = user.password;
	}

	async hashPassword(): Promise<void> {
		const saltRounds = 10;
		this.password = await bcrypt.hash(this.password, saltRounds);
	}

}
export class UserDTO {
	id?: string;
	email: string;
	name?: string | null;

	constructor(user: IUser) {
		this.id = user.id;
		this.name = user.name;
		this.email = user.email;
	}

}

