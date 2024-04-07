import { z } from "zod";
import { format, parse, differenceInDays, addYears, isToday, differenceInYears, intervalToDuration } from 'date-fns';
import { addressSchema, IAddresses } from "./Addresses";

export const personSchema = z.object({
  name: z.string(),
  sex: z.string(),
  dateOfBirth: z.coerce.date(),
  maritalStatus: z.string(),
  addresses: addressSchema.optional()
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
  birthdayMessage: string;
  maritalStatus: string;
  addresses?: IAddresses[];
  defaultAddress?: IAddresses;

  constructor(person: IPerson) {
    this.id = person.id;
    this.name = person.name;
    this.sex = person.sex;
    this.dateOfBirth = person.dateOfBirth;
    this.maritalStatus = person.maritalStatus;
    this.addresses = person.addresses;
    this.defaultAddress = person.addresses?.find(address => address.isDefault);

    const today = new Date();
    const nextBirthdayYear = today.getFullYear() + 1;
    const nextBirthday = new Date(nextBirthdayYear, person.dateOfBirth.getMonth(), person.dateOfBirth.getDate());
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    this.birthdayMessage = daysUntilBirthday === 364 ? "Feliz aniversário!" : `Faltam ${daysUntilBirthday} dia${daysUntilBirthday === 1 ? '' : 's'} para o seu aniversário.`;

  }
}


export function age(date: Date) {
  const
    birthdate = new Date(date),
    today = new Date();

  let age = today.getFullYear() - birthdate.getFullYear();

  if (birthdate.getDate() >= today.getDate() && birthdate.getMonth() >= today.getMonth()) age--;

  return age;
}
