import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../api/lib/jwt.handle';


const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
	try {
		const userJWT = req.headers.authorization || null;
		const jwt = userJWT?.split(' ').pop();
		const decoded = verifyAccessToken(`${jwt}`);

		if (!decoded) {
			res.status(401).json({ msg: '"INVALID_JWT"' });
		} else {
			console.log(req.user)
			req.user = decoded !== null ? decoded : undefined; // Verifica se o usuário não é nulo
			next();
		}
	} catch (error) {
		res.status(401).json({ msg: 'INVALID_SESSION' });
	}
};

export { ensureAuth };
