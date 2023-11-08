import bycript from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import {
  loginSchema,
  refreshTokenSchema,
  signupSchema,
} from './validations.js';

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

export const logout = async (req: Request, res: Response) => {
  try {
    const { body } = refreshTokenSchema.parse(req);

    refreshTokens.filter(token => token !== body.refreshToken);

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json(error);
  }
};

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

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { body } = refreshTokenSchema.parse(req);

    if (!refreshTokens.includes(body.refreshToken)) {
      return res.status(403).json({ message: 'Refresh Token inválido' });
    }

    const decoded = jwt.verify(body.refreshToken, env.JWT_SECRET);

    const accessToken = jwt.sign(decoded, env.JWT_SECRET);

    return res.json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
