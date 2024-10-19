import { NestApplication } from '@nestjs/core';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as request from 'supertest';

export const givenUserIsCreated = async (
  app: NestApplication,
  user: CreateUserDto,
) => {
  return await request(app.getHttpServer()).post('/users').send(user);
};
