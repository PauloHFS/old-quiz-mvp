import supertest from 'supertest';
import { app } from '../../index';

describe('auth', () => {
  describe('POST /auth/login', () => {
    it('should return 401 if email or password is incorrect', async () => {
      const response = await supertest(app).post('/auth/login').send({
        email: 'paulohernane@gmail.com',
        password: 'Ab@12312',
      });

      expect(response.status).toBe(401);
    });
  });
});
