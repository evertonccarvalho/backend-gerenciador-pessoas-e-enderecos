import { db } from '../api/config/prisma';
import { z } from 'zod';

import { AddressDTO, IAddresses, addressSchema, } from '../models/Addresses';

export class AddressesService {


	async create(personId: string, data: z.infer<typeof addressSchema>): Promise<AddressDTO> {
		try {
			const validatedData = addressSchema.parse(data);

			let createdAddress: IAddresses;

			if (validatedData.isDefault) {
				// Encontrar e atualizar o endereço existente com isDefault true para false
				const existingDefaultAddress = await db.addresses.findFirst({
					where: {
						personId: personId,
						isDefault: true,
					},
				});

				if (existingDefaultAddress) {
					await db.addresses.update({
						where: { id: existingDefaultAddress.id },
						data: { isDefault: false },
					});
				}
			}

			createdAddress = await db.addresses.create({
				data: {
					personId: personId,
					address: validatedData.address,
					number: validatedData.number,
					complement: validatedData.complement,
					neighborhood: validatedData.neighborhood,
					zipcode: validatedData.zipcode,
					city: validatedData.city,
					state: validatedData.state,
					isDefault: validatedData.isDefault,
					created_at: new Date()
				},
			});

			return new AddressDTO(createdAddress);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errorMessage = error.errors.map((err) => err.message).join('; ');
				console.error('Erro de validação ao registrar endereço:', errorMessage);
				throw new Error(errorMessage);
			} else {
				console.error('Erro ao registrar endereço:', error);
				throw new Error('Erro ao registrar endereço');
			}
		}
	}

	async update(id: string, personId: string, data: z.infer<typeof addressSchema>): Promise<AddressDTO> {
		try {
			const validatedData = addressSchema.parse(data);

			let updatedAddress: IAddresses;

			if (validatedData.isDefault) {
				// Encontrar e atualizar o endereço existente com isDefault true para false
				const existingDefaultAddress = await db.addresses.findFirst({
					where: {
						personId: personId,
						isDefault: true,
						NOT: {
							id: id, // Excluindo o endereço que está sendo atualizado
						},
					},
				});

				if (existingDefaultAddress) {
					await db.addresses.update({
						where: { id: existingDefaultAddress.id },
						data: { isDefault: false },
					});
				}
			}

			updatedAddress = await db.addresses.update({
				where: {
					id: id,
					personId: personId,
				},
				data: {
					address: validatedData.address,
					number: validatedData.number,
					complement: validatedData.complement,
					neighborhood: validatedData.neighborhood,
					zipcode: validatedData.zipcode,
					city: validatedData.city,
					state: validatedData.state,
					isDefault: validatedData.isDefault ?? false,
				},
			});

			return new AddressDTO(updatedAddress);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errorMessage = error.errors.map((err) => err.message).join('; ');
				console.error('Erro de validação ao atualizar endereço:', errorMessage);
				throw new Error(errorMessage);
			} else {
				console.error('Erro ao atualizar endereço:', error);
				throw new Error('Erro ao atualizar endereço');
			}
		}
	}

	async index(personId: string): Promise<AddressDTO[]> {
		const addresses = await db.addresses.findMany({
			where: { personId: personId },
			select: {
				id: true,
				personId: true,
				address: true,
				number: true,
				complement: true,
				zipcode: true,
				city: true,
				neighborhood: true,
				state: true,
				isDefault: true,
				created_at: true,
			}
		});
		return addresses.map(address => new AddressDTO(address));
	}

	async delete(id: string, personId: string): Promise<void> {
		await db.addresses.delete({
			where: {
				id,
				personId,
			}
		});
	}

	async toggleDefaultAddress(addressId: string, personId: string, setDefault: boolean): Promise<void> {
		if (setDefault) {
			// Desmarcar o endereço padrão anterior (se houver)
			await db.addresses.updateMany({
				where: {
					personId: personId,
					isDefault: true,
				},
				data: {
					isDefault: false,
				},
			});
		}

		// Definir ou remover o endereço como padrão
		await db.addresses.update({
			where: {
				id: addressId,
			},
			data: {
				isDefault: setDefault,
			},
		});
	}

}
