import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { IRegisterUser } from '../models/User';
import { UserService } from '../services/UserService';

const authService = new AuthService()
const userService = new UserService();

export class AuthController {

	handleCreate = async (req: Request, res: Response): Promise<void> => {
		const { name, email, password }: IRegisterUser = req.body;

		try {
			const existingUser = await userService.getByEmail(email);

			if (existingUser) {
				res
					.status(400)
					.json({ message: 'User with this email already exists' });
				return;
			}
			const newUser: IRegisterUser = {
				name,
				email,
				password,
			};
			const createdUser = await authService.create(newUser);

			res.status(201).json(createdUser);
		} catch (error) {
			console.error('Erro:', error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}

	handleLogin = async (req: Request, res: Response,) => {
		try {

			const refreshToken = req.headers.authorization?.split(' ').pop()

			const { email, password } = req.body;

			const accessToken = await authService.handleLogin(email, password, refreshToken!);

			if (!accessToken) {
				return res.status(401).json({ message: 'Invalid credentials' });
			}

			if (accessToken === 'INCORRECT_PASSWORD') {
				res.status(400).json({
					msg: 'User/Password incorrect',
				});
			} else {
				res.json(accessToken);
			}
		} catch (error) {
			console.log('ERROR_LOGIN_USER', error);
			res.status(400).json({ errors: error });
		}
	};

	handleRefresh = async (req: Request, res: Response) => {
		try {
			const refreshToken = req.body.refreshToken as string;

			if (!refreshToken) {
				// throw new Error('Refresh token is missing')
				return res.status(400).json({ error: 'Refresh token is missing' });
			}

			const accessToken = await authService.handleRefresh(refreshToken!);

			if (!accessToken) {
				console.error('Error refreshing access token: Access token not found');
				return res.status(500).json({ error: 'Access token not found' });
			}

			return res.status(200).json(accessToken);
		} catch (error) {
			console.error('Error refreshing access token:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	};

	handleVerify = async (req: Request, res: Response) => {
		try {
			const accessToken = req.headers.authorization?.split(' ').pop()

			if (!accessToken) {
				return res.status(400).json({ error: 'TOKEN token is missing' });
			}

			const user = await authService.handleVeirfy(accessToken!);

			if (!accessToken) {
				console.error('Error refreshing access token: Access token not found');
				return res.status(500).json({ error: 'Access token not found' });
			}

			return res.status(200).json(user);
		} catch (error) {
			console.error('Error refreshing access token:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	};

}
