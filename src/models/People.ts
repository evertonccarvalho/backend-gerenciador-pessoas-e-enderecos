export interface IPeople {
  id: string;
  name: string;
  sex: string;
  dateOfBirth: Date
  maritalStatus: string
  addresses?: any[];
}

export class PeopleDTO {
  id: string;
  name: string;
  sex: string;
  dateOfBirth: Date
  maritalStatus: string
  addresses?: any[];

  constructor(people: IPeople) {
    this.id = people.id;
    this.name = people.name;
    this.sex = people.sex;
    this.dateOfBirth = people.dateOfBirth;
    this.maritalStatus = people.maritalStatus;
    this.addresses = people.addresses;
  }
}