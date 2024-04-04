import { Request, Response } from 'express';
import { AddressesService } from '../services/AddressesService';
import { addressSchema, IAddresses } from '../models/Addresses';

const addressesService: AddressesService = new AddressesService();

export class AddressesController {

	async handleCreate(req: Request, res: Response): Promise<void> {

		try {
			const { personId } = req.params; // Supondo que personId esteja presente nos parâmetros da URL
			const validatedData = addressSchema.parse(req.body);
			const createdAddress = await addressesService.create(personId, validatedData);
			res.status(201).json(createdAddress);
		} catch (error) {
			console.error('Erro:', error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}

	async handleUpdate(req: Request, res: Response): Promise<void> {

		try {
			const { personId, id } = req.params; //
			const validatedData = addressSchema.parse(req.body);
			const updatedAddress = await addressesService.update(id, personId, validatedData);
			res.status(200).json(updatedAddress);
		} catch (error) {
			console.error('Erro ao atualizar endereço:', error);
			res.status(500).json({ message: 'Erro ao atualizar endereço' });
		}
	}

	async handleIndex(req: Request, res: Response): Promise<void> {
		const { personId } = req.params; //
		try {
			const address = await addressesService.index(personId);
			res.status(200).json(address);
		} catch (error) {
			console.error("Error: ", error);
			res.status(500).json({ message: "Erro Interno do servidor", error: error });
		}
	}

	async handleDelete(req: Request, res: Response): Promise<void> {
		try {
			const { personId, id } = req.params;
			await addressesService.delete(id, personId);
			res.status(200).json({ success: true, message: "Endereço deletado com sucesso." });
		} catch (error) {
			console.error('Erro ao excluir endereço:', error);
			res.status(500).json({ message: 'Erro ao excluir endereço' });
		}
	}

	async toggleDefaultAddress(req: Request, res: Response): Promise<void> {
		const { personId, id } = req.params; //
		const setDefault: boolean = req.body.setDefault;
		try {
			await addressesService.toggleDefaultAddress(id, personId, setDefault);
			res.status(200).json({ message: 'Endereço padrão atualizado com sucesso' });
		} catch (error) {
			console.error('Erro ao atualizar endereço padrão:', error);
			res.status(500).json({ message: 'Erro ao atualizar endereço padrão' });
		}
	}

}
