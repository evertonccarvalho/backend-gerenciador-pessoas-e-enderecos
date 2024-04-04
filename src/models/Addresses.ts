import { z } from 'zod';

export const addressSchema = z.object({
	address: z.string(),
	number: z.coerce.number(),
	complement: z.string(),
	zipcode: z.string(),
	city: z.string(),
	neighborhood: z.string(),
	state: z.string(),
	isDefault: z.boolean().default(false),
});

export interface IAddresses {
	id: String;
	personId: string;
	address: string;
	number: number;
	complement: string;
	zipcode: string;
	city: string;
	neighborhood: string;
	state: string;
	isDefault: boolean;
	created_at: Date | null;
}

export class AddressDTO {
	id: String;
	personId: string;
	address: string;
	number: number;
	complement: string;
	zipcode: string;
	city: string;
	neighborhood: string;
	state: string;
	isDefault: boolean;
	created_at: Date | null;

	constructor(address: IAddresses) {
		this.id = address.id;
		this.personId = address.personId;
		this.address = address.address;
		this.number = address.number;
		this.complement = address.complement;
		this.neighborhood = address.neighborhood;
		this.state = address.state;
		this.zipcode = address.zipcode;
		this.city = address.city;
		this.isDefault = address.isDefault;
		this.created_at = address.created_at;
	}
}
