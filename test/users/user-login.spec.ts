import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.entity';
import * as request from 'supertest';
import { givenUserIsCreated } from './user-shared-steps';

const whenIRequestLogin = async (app, loginUserDto: LoginUserDto) => {
  return request(app.getHttpServer()).post('/users/login').send(loginUserDto);
};

const expectJwtTokenProperty = (
  response: request.Response,
  property: string,
) => {
  const token = response.body.token;
  const payload = token.split('.')[1];
  const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
  return expect(decodedPayload[property]);
};

describe('User login', () => {
  const user = {
    user: 'user',
    password: 'user',
    name: 'user',
    lastName: 'user',
    mail: 'string@string.com',
  };
  let app: NestApplication;

  afterEach(async () => {
    await User.delete({});
  });

  beforeAll(async () => {
    app = await NestFactory.create(AppModule);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return token if valid credentials given', async () => {
    givenUserIsCreated(app, user);
    const response = await whenIRequestLogin(app, {
      user: 'user',
      password: 'user',
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    expectJwtTokenProperty(response, 'user').toBe('user');
    expectJwtTokenProperty(response, 'hashedPassword').toBeUndefined();
  });

  it('should return 400 if user and password are correct', async () => {
    givenUserIsCreated(app, user);
    const response = await whenIRequestLogin(app, {
      user: 'wrongUser',
      password: 'wrongPassword',
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 if user is registered but password is not right', async () => {
    givenUserIsCreated(app, user);
    const response = await whenIRequestLogin(app, {
      user: 'user',
      password: 'wrongPassword',
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
});
