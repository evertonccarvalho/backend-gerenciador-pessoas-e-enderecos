import { UserType } from '@prisma/client';
import type { JwtPayload } from 'jsonwebtoken';
interface User {
  id: string
  name: string
  email: string
}
declare global {
  namespace Express {
    export interface Request {
      user?: User | string | JwtPayload;
    }
  }
}
