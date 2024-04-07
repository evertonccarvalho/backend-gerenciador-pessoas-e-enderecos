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
  maritalStatus: string;
  addresses?: IAddresses[];
  birthdayMessage: string;
  daysUntilNextBirthday: number;
  currentAge: number;
  defaultAddress?: IAddresses; // Adicionando a propriedade defaultAddress

  constructor(person: IPerson) {


    const today = new Date();
    const age = differenceInYears(today, person.dateOfBirth);
    const nextBirthday = addYears(person.dateOfBirth, age);
    const daysUntilBirthday = differenceInDays(nextBirthday, today);

    let birthdayMessage;

    if (daysUntilBirthday === 0) {
      birthdayMessage = `Feliz ${age}º aniversário!`;
    } else {
      birthdayMessage = `Faltam ${daysUntilBirthday + 366} dia${daysUntilBirthday + 366 === 1 ? '' : 's'} para o seu ${age + 1}º aniversário.`;
    }


    this.birthdayMessage = birthdayMessage;
    this.currentAge = age;
    this.daysUntilNextBirthday = daysUntilBirthday;

    this.id = person.id;
    this.name = person.name;
    this.sex = person.sex;
    this.dateOfBirth = person.dateOfBirth;
    this.maritalStatus = person.maritalStatus;
    this.addresses = person.addresses;
    this.defaultAddress = person.addresses?.find(address => address.isDefault);


  }
}
