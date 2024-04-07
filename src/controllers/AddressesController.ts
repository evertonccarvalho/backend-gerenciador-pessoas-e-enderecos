import { Request, Response } from 'express';
import { AddressesService } from '../services/AddressesService';
import { addressSchema, IAddresses } from '../models/Addresses';

const addressesService: AddressesService = new AddressesService();

export class AddressesController {

	private handleError(res: Response, error: any): void {
		console.error('Erro:', error);
		res.status(500).json({ message: 'Internal Server Error', error });
	}

	async handleCreate(req: Request, res: Response): Promise<void> {
		try {
			const { personId } = req.params;
			const validatedData = addressSchema.parse(req.body);
			const createdAddress = await addressesService.create(personId, validatedData);
			res.status(201).json(createdAddress);
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handleUpdate(req: Request, res: Response): Promise<void> {
		try {
			const { personId, id } = req.params;
			const validatedData = addressSchema.parse(req.body);
			const updatedAddress = await addressesService.update(id, personId, validatedData);
			res.status(200).json(updatedAddress);
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handleIndex(req: Request, res: Response): Promise<void> {
		try {
			const { personId } = req.params;
			const address = await addressesService.index(personId);
			res.status(200).json(address);
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handleDelete(req: Request, res: Response): Promise<void> {
		try {
			const { personId, id } = req.params;
			await addressesService.delete(id, personId);
			res.status(200).json({ success: true, message: "Endereço deletado com sucesso." });
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async toggleDefaultAddress(req: Request, res: Response): Promise<void> {
		const { personId, id } = req.params;
		const setDefault: boolean = req.body.setDefault;
		try {
			await addressesService.toggleDefaultAddress(id, personId, setDefault);
			res.status(200).json({ message: 'Endereço padrão atualizado com sucesso' });
		} catch (error) {
			this.handleError(res, error);
		}
	}

}
