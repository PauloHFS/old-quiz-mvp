import bycript from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { prismaClient } from '../../database/index';
import { resend } from '../../services/resend';
import { JwtData } from '../../types';
import {
  loginSchema,
  refreshTokenSchema,
  signupSchema,
  verifyTokenSchema,
} from './validations';

export const login = async (req: Request, res: Response) => {
  try {
    const { body } = loginSchema.parse(req);

    const user = await prismaClient.user.findUnique({
      where: {
        email: body.email,
        verified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        verified: true,
      },
    });

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

    const session = await prismaClient.session.create({
      data: {
        refreshToken,
        user: {
          connect: {
            id: userData.id,
          },
        },
      },
    });

    return res.json({ accessToken, refreshToken: session.refreshToken });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { body } = signupSchema.parse(req);

    const hashedPassword = await bycript.hash(body.password, 10);

    const user = await prismaClient.user.create({
      data: {
        name: body.nome,
        email: body.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        verified: true,
      },
    });

    // TODO melhorar esse fluxo, adicionar tempo de expiração no token
    const accessToken = jwt.sign(user, env.JWT_SECRET);

    if (env.NODE_ENV === 'development') {
      console.log(`http://localhost:5173/auth/verify?token=${accessToken}`);
    } else {
      resend.emails.send({
        from: 'Quiz MVP <quiz-mvp@resend.dev>',
        to: user.email,
        subject: 'Bem-vindo ao Quiz MVP',
        text: `Olá ${user.name}, seja bem-vindo ao Quiz MVP!\n\nAcesse o link abaixo para confirmar seu cadastro:\n\nhttp://localhost:5173/auth/verify?token=${accessToken}`,
      });
    }

    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { body } = refreshTokenSchema.parse(req);

    const refreshToken = await prismaClient.session.findFirst({
      where: {
        refreshToken: body.refreshToken,
      },
    });

    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh Token inválido' });
    }

    const { id, name, email, verified } = jwt.verify(
      body.refreshToken,
      env.JWT_SECRET
    ) as JwtData;

    const accessToken = jwt.sign(
      {
        id,
        name,
        email,
        verified,
      },
      env.JWT_SECRET,
      {
        expiresIn: '15m',
      }
    );

    return res.json({ accessToken });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { body } = verifyTokenSchema.parse(req);

    const { id, name, email, verified } = jwt.verify(
      body.token,
      env.JWT_SECRET
    ) as JwtData;

    if (verified) {
      return res.status(400).json({ message: 'Usuário já verificado' });
    }

    const user = await prismaClient.user.update({
      where: {
        id,
        name,
        email,
        verified: false,
      },
      data: {
        verified: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};
