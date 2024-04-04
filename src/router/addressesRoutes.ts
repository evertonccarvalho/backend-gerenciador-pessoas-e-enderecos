import { Router } from 'express';
import { AddressesController } from '../controllers/AddressesController';

const addressesRouter = Router();
const addressesController = new AddressesController();

// Rotas para manipulação de endereços
addressesRouter.post('/persons/:personId/addresses', addressesController.handleCreate);
addressesRouter.get('/persons/:personId/addresses', addressesController.handleIndex);
addressesRouter.put('/persons/:personId/addresses/:id', addressesController.handleUpdate);
addressesRouter.put('/persons/:personId/addresses/:id/default', addressesController.toggleDefaultAddress);
addressesRouter.delete('/persons/:personId/addresses/:id', addressesController.handleDelete);

export default addressesRouter;
