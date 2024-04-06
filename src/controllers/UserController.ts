import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService: UserService = new UserService();

export class UserController {

	async getUserById(req: Request, res: Response): Promise<void> {
		try {
			const userId: string = req.params.id;
			const user = await userService.getById(userId);
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ message: 'User not found' });
			}
		} catch (error) {
			console.error('Erro:', error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}

	async show(req: Request, res: Response): Promise<void> {
		try {
			const { user } = req;
			if (user && typeof user !== 'string' && 'id' in user) {
				const userId = user.id;
				const fetchedUser = await userService.show(userId);
				if (fetchedUser) {
					res.status(200).json(fetchedUser);
				} else {
					res.status(404).json({ message: 'User not found' });
				}
			} else {
				res.status(401).json({ message: 'Unauthorized' });
			}
		} catch (error) {
			console.error('Erro:', error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}




}
