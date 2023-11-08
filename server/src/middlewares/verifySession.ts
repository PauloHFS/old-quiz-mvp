import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prismaClient } from '../database/index.js';

export const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      return res.status(404).send();
    }

    const userData = jwt.verify(accessToken, env.JWT_SECRET);

    const user = await prismaClient.user.findUnique({
      where: {
        id: (userData as any).id,
        email: (userData as any).email,
        name: (userData as any).name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).send();
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(404).json(error);
  }
};
