import app from './app';
import { db } from './config/prisma';
import { env } from './config/env';

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
	db.$connect();

	console.log(`Server started successfully at port ${PORT}`);
});
