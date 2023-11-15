import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prismaClient } from '../database/index';
import { JwtData } from '../types';

export const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      return res.status(401).send();
    }

    const { id, name, email, verified } = jwt.verify(
      accessToken,
      env.JWT_SECRET
    ) as JwtData;

    const user = await prismaClient.user.findUnique({
      where: {
        id,
        name,
        email,
        verified,
      },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
      },
    });

    if (!user) {
      return res.status(401).send();
    }

    req.body.user = user;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Sessão expirada' });
    }

    return res.status(401).json(error);
  }
};
