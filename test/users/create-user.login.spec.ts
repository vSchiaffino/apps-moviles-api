import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/user.entity';
import { givenUserIsCreated } from './user-shared-steps';

describe('User creation', () => {
  let app: NestApplication;
  let user = {
    user: 'user',
    password: 'user',
    name: 'user',
    lastName: 'user',
    mail: 'string@string.com',
  };

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

  it('should return the created user if valid data given', async () => {
    const response = await givenUserIsCreated(app, user);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('user', user.user);
    expect(response.body).toHaveProperty('mail', user.mail);
    expect(response.body).toHaveProperty('id');
    expect(response.body.hashedPassword).toBeUndefined();
  });
  it('should create the user in the db if valid data given', async () => {
    await User.delete({});
    await givenUserIsCreated(app, user);
    const userInDb = await User.find({ where: { user: user.user } });
    expect(userInDb).toBeDefined();
  });
  it('should return 409 if email is already registered', async () => {
    await givenUserIsCreated(app, user);
    const response = await givenUserIsCreated(app, {
      user: 'user2',
      password: 'user2',
      name: 'user2',
      lastName: 'user2',
      mail: user.mail,
    });
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('message');
  });
  it('should return 409 if user is already registered', async () => {
    await givenUserIsCreated(app, user);
    const response = await givenUserIsCreated(app, {
      user: user.user,
      password: 'user2',
      name: 'user2',
      lastName: 'user2',
      mail: 'user2@gmail.com',
    });
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('message');
  });
  it('should return 409 if both user and email are already registered', async () => {
    await givenUserIsCreated(app, user);
    const response = await givenUserIsCreated(app, {
      user: user.user,
      password: 'user2',
      name: 'user2',
      lastName: 'user2',
      mail: user.mail,
    });
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('message');
  });
});
