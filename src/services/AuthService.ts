import { db } from '../api/config/prisma';
import { verify } from '../api/lib/bcrypt.handle';
import { z } from 'zod';
import { JwtPayload } from 'jsonwebtoken';
import { UserDTO, UserRegisterDTO } from '../models/User';
import { registerSchema } from '../validations/user';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, } from '../api/lib/jwt.handle';

export class AuthService {

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
	async handleLogin(email: string, password: string, refreshToken: string) {
		const user = await db.user.findUnique({
			where: {
				email,
			},
			select: {
				id: true,
				name: true,
				email: true,
				password: true,
			},
		});


		if (!user) {
			return null;
		}

		// Removendo a senha dos dados do usuário
		const { password: hashedPassword, ...userData } = user;

		const isValidPassword = await verify(password, hashedPassword);
		if (!isValidPassword) return 'INCORRECT_PASSWORD';

		if (refreshToken) {
			// Verifica se o token de atualização fornecido pertence ao usuário atual
			const checkRefreshToken = await db.refreshToken.findUnique({
				where: {
					token: refreshToken
				}
			});
			// Se este token não existe no banco de dados ou pertence a outro usuário,
			// então nós removemos todos os tokens de atualização do usuário no banco de dados
			if (!checkRefreshToken || checkRefreshToken.userId !== user.id) {
				await db.refreshToken.deleteMany({
					where: {
						userId: user.id,
					}
				})
			} else {
				// Caso contrário, tudo está bem e só precisamos excluir o único token
				await db.refreshToken.delete({
					where: {
						token: refreshToken
					}
				})
			}
		}

		if (!refreshToken) {
			const accessToken = await generateAccessToken(user.id);
			const newRefreshToken = await generateRefreshToken(user.id);

			await db.refreshToken.create({
				data: {
					token: newRefreshToken,
					userId: user.id
				}
			});

			const data = {
				accessToken: accessToken,
				refreshToken: newRefreshToken,
			};

			return data;

		}

		const accessToken = await generateAccessToken(user.id);
		const newRefreshToken = await generateRefreshToken(user.id);

		await db.refreshToken.create({
			data: {
				token: newRefreshToken,
				userId: user.id
			}
		})

		const data = {
			token: accessToken,
			refreshToken: newRefreshToken,
		};

		return data
	};
	async handleVeirfy(accessToken: string) {
		try {
			const payload = verifyAccessToken(accessToken)
			// console.log("payload", payload)
			if (!payload) {
				throw new Error("TOKEN INVALIDO")
			}
			return payload
		} catch (error) {
			console.log(error)
		}
	}
	async handleRefresh(refreshToken: string) {
		try {

			// Verificar se o token de atualização está presente no banco de dados
			const foundRefreshToken = await db.refreshToken.findUnique({
				where: { token: refreshToken },
			});

			// Se o token de atualização não for encontrado, isso indica uma tentativa de reutilização do token

			if (!foundRefreshToken) {
				try {
					// Verifica se houve tentativa de reutilização do token
					verifyRefreshToken(refreshToken);
					// Remove todos os tokens de atualização do usuário do banco de dados
					async (err: unknown, payload: JwtPayload) => {
						if (err) return console.log(err);
						console.log('Attempted refresh token reuse!');
						await db.refreshToken.deleteMany({
							where: {
								userId: payload.id
							}
						});
					}

					console.log('Tokens de atualização removidos');
					return "Tokens de atualização removidos com sucesso";
				} catch (error) {
					// Se ocorrer um erro ao verificar o token, ou ao remover os tokens de atualização, trate aqui
					console.error('Erro ao remover tokens de atualização:', error);
					return "Erro ao remover tokens de atualização";
				}
			}


			// Deletar o token de atualização do banco de dados
			await db.refreshToken.delete({
				where: {
					token: refreshToken
				}
			})
			console.log('Token de atualização deletado');

			// Se o token de atualização for encontrado no banco de dados, gerar novos tokens de acesso e atualização
			console.log('Found refresh token', foundRefreshToken);
			const accessToken = await generateAccessToken(foundRefreshToken.userId);
			const newRefreshToken = await generateRefreshToken(foundRefreshToken.userId);

			// Armazenar o novo token de atualização no banco de dados
			await db.refreshToken.create({
				data: {
					token: newRefreshToken,
					userId: foundRefreshToken.userId
				}
			}).catch((err: Error) => {
				console.error('erro ao armazenar novos tokens', err);
			});

			console.log('Novo token de atualização criado');
			// Retornar os novos tokens de acesso e atualização

			const data = {
				token: accessToken,
				refreshToken: newRefreshToken,
			};
			console.log('Tokens atualizados:', data);
			return data;

		} catch (error) {
			if (error instanceof Error)
				throw new Error('Error handling refresh: ' + error.message);

		}
	};
}


