import { Router } from 'express';
import { PersonController } from '../controllers/PersonController';

const personRouter = Router();
const personController = new PersonController();

personRouter.post('/persons', personController.handleCreate);
personRouter.put('/persons/:id', personController.handleUpdate);
personRouter.get('/persons', personController.handleIndex);
personRouter.get('/persons/:id', personController.handleGetById);
personRouter.delete('/persons/:id', personController.handleDelete);

export { personRouter };
