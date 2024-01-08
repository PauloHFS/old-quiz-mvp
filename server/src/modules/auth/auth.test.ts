import supertest from 'supertest';
import { prismaClient } from '../../database';
import { app } from '../../index';

describe('auth', () => {
  describe('POST /auth/login', () => {
    it('should return 400 if email is not provided', async () => {
      const response = await supertest(app).post('/auth/login').send({
        password: 'Ab@12312',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      const response = await supertest(app).post('/auth/login').send({
        email: 'paulohernane10@gmail.com',
      });

      expect(response.status).toBe(400);
    });

    it('should return 401 if email or password is incorrect', async () => {
      const response = await supertest(app).post('/auth/login').send({
        email: 'paulohernane@gmail.com',
        password: 'Ab@12312',
      });

      expect(response.status).toBe(401);
    });

    it('should return 200 if email and password is correct', async () => {
      const response = await supertest(app).post('/auth/login').send({
        email: 'paulohernane10@gmail.com',
        password: 'Ab@12312',
      });

      expect(response.status).toBe(200);
    });
  });

  describe('POST /auth/signup', () => {
    it('should return 400 if name is not provided', async () => {
      const response = await supertest(app).post('/auth/signup').send({
        email: 'paulohernane@gmail.com',
        password: 'Ab@12312',
      });
      expect(response.status).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
      const response = await supertest(app).post('/auth/signup').send({
        name: 'Paulo Hernane',
        password: 'Ab@12312',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      const response = await supertest(app).post('/auth/signup').send({
        name: 'Paulo Hernane',
        email: 'paulohernane10@gmail.com',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 if email is invalid', async () => {
      const response = await supertest(app).post('/auth/signup').send({
        name: 'Paulo Hernane',
        email: 'paulohernane10gmail.com',
        password: 'Ab@12312',
      });

      expect(response.status).toBe(400);
    });

    it('should return 201 if user is created', async () => {
      const response = await supertest(app).post('/auth/signup').send({
        nome: 'Usuário de teste',
        email: 'usuarioDeTest@gmail.com',
        password: 'Ab@12312',
      });

      expect(response.status).toBe(201);

      await prismaClient.user.delete({
        where: {
          email: 'usuarioDeTest@gmail.com',
        },
      });
    });
  });

  describe('POST /auth/refresh-token', () => {});

  describe('POST /auth/verify-token', () => {});
});
