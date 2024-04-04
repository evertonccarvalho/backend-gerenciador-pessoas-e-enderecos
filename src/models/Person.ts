import { z } from "zod";
import { format, parse, differenceInDays, addYears, isToday, differenceInYears, intervalToDuration } from 'date-fns';
import { addressSchema, IAddresses } from "./Addresses";

export const personSchema = z.object({
  name: z.string(),
  sex: z.string(),
  dateOfBirth: z.coerce.date(),
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
  birthdayMessage: string;
  daysUntilNextBirthday: number;
  currentAge: number;

  constructor(person: IPerson) {
    const today = new Date();
    const age = differenceInYears(today, person.dateOfBirth);
    const nextBirthday = addYears(person.dateOfBirth, age);
    const daysUntilBirthday = differenceInDays(nextBirthday, today);

    this.id = person.id;
    this.name = person.name;
    this.sex = person.sex;
    this.dateOfBirth = person.dateOfBirth;
    this.maritalStatus = person.maritalStatus;
    this.addresses = person.addresses;
    this.currentAge = age;
    this.daysUntilNextBirthday = isToday(person.dateOfBirth) ? 0 : daysUntilBirthday;
    this.birthdayMessage = this.daysUntilNextBirthday === 0 ? "Feliz aniversário!" : `Falta${daysUntilBirthday === 1 ? '' : 'm'} ${Math.abs(daysUntilBirthday)} dia${daysUntilBirthday === 1 ? '' : 's'} para o seu aniversário.`;
  }
}
