import bycript from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { loginSchema, signupSchema } from './validations.js';

const users: {
  nome: string;
  email: string;
  password: string;
}[] = [];

const refreshTokens: string[] = [];

export const login = async (req: Request, res: Response) => {
  try {
    const { body } = loginSchema.parse(req);

    const user = users.find(user => user.email === body.email);

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const { password, ...userData } = user;

    const passwordMatch = await bycript.compare(body.password, password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const accessToken = jwt.sign(userData, env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(userData, env.JWT_SECRET, {
      expiresIn: '7d',
    });

    refreshTokens.push(refreshToken);

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const logout = async (req: Request, res: Response) => {};

export const signup = async (req: Request, res: Response) => {
  try {
    const { body } = signupSchema.parse(req);

    const hashedPassword = await bycript.hash(body.password, 10);

    users.push({ ...body, password: hashedPassword });

    return res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {};
