import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { router } from './router';

export class App {
	public server: express.Application;

	public constructor() {
		this.server = express();
		this.initialize();
	}

	protected initialize() {
		this.server.use(cors());
		this.server.use(bodyParser.json());
		this.server.use(bodyParser.urlencoded({ extended: true }));
		this.server.use('/api', router);
	}
}

export default new App().server;
