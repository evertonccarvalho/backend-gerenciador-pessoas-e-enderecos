import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import { env } from '../config/env';


const generateAccessToken = async (id: string) => {
	const accessToken = sign({ id }, env.ACCESS_TOKEN_SECRET, {
		expiresIn: 60 * 60
	});

	return accessToken;
};

const generateRefreshToken = (id: string) => {
	const refreshToken = sign({ id }, env.REFRESH_TOKEN_SECRET, {
		expiresIn: 60 * 60 * 60
	});

	return refreshToken;
};

const verifyAccessToken = (jwt: string) => {
	try {
		const isTokenOk = verify(jwt, env.ACCESS_TOKEN_SECRET);
		return isTokenOk;
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			// Token inválido ou malformado
			return null;
		} else {
			// Outro erro de verificação
			throw error;
		}
	}
};

const verifyRefreshToken = (jwt: string) => {
	try {
		const isTokenOk = verify(jwt, env.REFRESH_TOKEN_SECRET);
		return isTokenOk;
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			// Token inválido ou malformado
			return null;
		} else {
			// Outro erro de verificação
			throw error;
		}
	}
};


export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };