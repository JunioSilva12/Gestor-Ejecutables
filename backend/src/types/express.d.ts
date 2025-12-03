import { User } from '../users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User; // opcional, pero tipado como tu entidad User
    }
  }
}
