import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyAccessToken } from '../api/lib/jwt.handle';

interface RequestExt extends Request {
	user?: string | JwtPayload;
}

const ensureAuth = (req: RequestExt, res: Response, next: NextFunction) => {
	try {
		const userJWT = req.headers.authorization || null;
		const jwt = userJWT?.split(' ').pop();
		const user = verifyAccessToken(`${jwt}`);

		if (!user) {
			res.status(401).json({ msg: '"INVALID_JWT"' });
		} else {
			req.user = user;
			next();
		}
	} catch (error) {
		res.status(401).json({ msg: 'INVALID_SESSION' });
	}
};

export { ensureAuth };
