import { Request, Response } from 'express';
import { PersonService } from "../services/PersonService";
import { personSchema } from '../models/Person';

const personService = new PersonService();

export class PersonController {
  private handleError(res: Response, error: any): void {
    console.error('Erro:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }

  async handleCreate(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = personSchema.parse(req.body);
      const person = await personService.create(validatedData);
      res.status(201).json(person);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async handleUpdate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = personSchema.parse(req.body);
      const updatedPerson = await personService.update(id, validatedData);
      res.status(200).json({ success: true, message: "Atualizado com sucesso.", person: updatedPerson });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async handleIndex(req: Request, res: Response): Promise<void> {
    try {
      const personList = await personService.index();
      if (!personList || personList.length === 0) {
        res.status(404).json({ message: 'No data available' });
      } else {
        res.status(200).json(personList);
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async handleGetById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const person = await personService.getById(id);
      if (person) {
        res.status(200).json(person);
      } else {
        res.status(404).json({ success: false, message: "Pessoa não encontrada." });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async handleDelete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await personService.delete(id);
      res.status(200).json({ success: true, message: "Pessoa deletada com sucesso." });
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
