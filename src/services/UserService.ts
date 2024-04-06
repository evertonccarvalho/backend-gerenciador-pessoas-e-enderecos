import { UserDTO, UserRegisterDTO } from '../models/User';
import { db } from '../api/config/prisma';
import { registerSchema, } from '../validations/user';
import { z } from 'zod';

export class UserService {

	async getByEmail(email: string): Promise<UserDTO | null> {
		const user = await db.user.findFirst({
			where: {
				email: email,
			},
		});
		return user && new UserDTO(user);;
	}

	async getById(id: string): Promise<UserDTO | null> {
		const user = await db.user.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				name: true,
				email: true,
				address: true,
			},
		});
		return user && new UserDTO(user)
	}

	async show(id: string): Promise<UserDTO | null> {
		const user = await db.user.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
		});

		if (user) {
			return new UserDTO(user);
		} else {
			return null;
		}
	}

}
