import { UserDTO, UserRegisterDTO } from '../models/User';
import { db } from '../api/config/prisma';
import { registerSchema, } from '../validations/user';
import { z } from 'zod';

export class UserService {

	async create(data: z.infer<typeof registerSchema>): Promise<UserDTO> {
		try {
			const validatedData = registerSchema.parse(data);

			const user = new UserRegisterDTO(validatedData);

			await user.hashPassword();

			const createdUser = await db.user.create({
				data: {
					name: user.name,
					email: user.email,
					password: user.password,
				},
			});

			return new UserDTO(createdUser);

		} catch (error) {
			if (error instanceof z.ZodError) {
				const errorMessage = error.errors.map((err) => err.message).join('; ');
				console.error('Erro de validação ao registrar usuário:', errorMessage);
				throw new Error(errorMessage);
			} else {
				console.error('Erro ao registrar usuário:', error);
				throw new Error('Erro ao registrar usuário');
			}
		}
	}

	async index(): Promise<UserDTO[]> {
		const users = await db.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
			},
		});
		return users.map(user => new UserDTO(user))
	}

	async delete(id: string): Promise<void> {
		await db.user.delete({
			where: { id: id },
		});
	}

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
		return user && new UserDTO(user)
	}
}
