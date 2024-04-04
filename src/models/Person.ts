import { z } from "zod";
import { addressSchema, IAddresses } from "./Addresses";

export const personSchema = z.object({
  name: z.string(),
  sex: z.string(),
  dateOfBirth: z.date(),
  maritalStatus: z.string(),
});

export interface IPerson {
  id: string;
  name: string;
  sex: string;
  dateOfBirth: Date;
  maritalStatus: string;
  addresses?: IAddresses[];
}

export class PersonDTO {
  id: string;
  name: string;
  sex: string;
  dateOfBirth: Date;
  maritalStatus: string;
  addresses?: IAddresses[];

  constructor(person: IPerson) {
    this.id = person.id;
    this.name = person.name;
    this.sex = person.sex;
    this.dateOfBirth = person.dateOfBirth;
    this.maritalStatus = person.maritalStatus;
    this.addresses = person.addresses;
  }
}
