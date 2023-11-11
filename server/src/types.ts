import { JwtPayload } from 'jsonwebtoken';

export interface JwtData extends JwtPayload {
  id: number;
  name: string;
  email: string;
}
