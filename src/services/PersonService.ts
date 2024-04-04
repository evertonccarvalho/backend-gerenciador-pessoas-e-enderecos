import { db } from "../api/config/prisma";
import { PersonDTO, personSchema } from "../models/Person";
import { z } from 'zod';

export class PersonService {

  async create(data: z.infer<typeof personSchema>): Promise<PersonDTO> {
    try {
      const validatedData = personSchema.parse(data);
      const createdPerson = await db.person.create({
        data: {
          name: validatedData.name,
          sex: validatedData.sex,
          dateOfBirth: validatedData.dateOfBirth,
          maritalStatus: validatedData.maritalStatus,
        }
      });
      return new PersonDTO(createdPerson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrorMessage = error.errors.join('; ');
        console.error('Erro de validação ao registrar pessoa:', validationErrorMessage);
        throw new Error(validationErrorMessage);
      } else {
        console.error('Erro ao registrar pessoa:', error);
        throw new Error('Erro ao registrar pessoa');
      }
    }
  }

  async update(id: string, data: z.infer<typeof personSchema>): Promise<PersonDTO> {
    try {
      const validatedData = personSchema.parse(data);
      const updatedPerson = await db.person.update({
        where: {
          id,
        },
        data: {
          name: validatedData.name,
          sex: validatedData.sex,
          dateOfBirth: validatedData.dateOfBirth,
          maritalStatus: validatedData.maritalStatus,
        }
      });
      return new PersonDTO(updatedPerson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrorMessage = error.errors.join('; ');
        console.error('Erro de validação ao atualizar pessoa:', validationErrorMessage);
        throw new Error(validationErrorMessage);
      } else {
        console.error('Erro ao atualizar pessoa:', error);
        throw new Error('Erro ao atualizar pessoa');
      }
    }
  }

  async index(): Promise<PersonDTO[]> {
    const personList = await db.person.findMany({
      select: {
        id: true,
        addresses: true,
        dateOfBirth: true,
        maritalStatus: true,
        name: true,
        sex: true,
      }
    });
    return personList.map(person => new PersonDTO(person));
  }

  async getById(id: string): Promise<PersonDTO | null> {
    const person = await db.person.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        addresses: true,
        dateOfBirth: true,
        maritalStatus: true,
        name: true,
        sex: true,
      }
    });
    return person && new PersonDTO(person);
  }

  async delete(id: string): Promise<void> {
    await db.person.delete({
      where: {
        id,
      }
    });
  }

}
