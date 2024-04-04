import { Request, Response } from 'express';
import { PersonService } from "../services/PersonService";
import { personSchema } from '../models/Person';

const personService = new PersonService();

export class PersonController {
  async handleCreate(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = personSchema.parse(req.body);
      const person = await personService.create(validatedData);
      res.status(201).json({ success: true, message: "Criado com sucesso.", person });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async handleUpdate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = personSchema.parse(req.body);
      const updatedPerson = await personService.update(id, validatedData);
      res.status(200).json({ success: true, message: "Atualizado com sucesso.", person: updatedPerson });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async handleIndex(req: Request, res: Response): Promise<void> {
    try {
      const personList = await personService.index();
      res.status(200).json(personList);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async handleGetById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const person = await personService.getById(id);
      if (person) {
        res.status(200).json({ success: true, message: "Pessoa encontrada.", person });
      } else {
        res.status(404).json({ success: false, message: "Pessoa não encontrada." });
      }
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async handleDelete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await personService.delete(id);
      res.status(200).json({ success: true, message: "Pessoa deletada com sucesso." });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
