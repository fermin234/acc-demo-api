import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { setupApp } from '@config/app.config';
import { datasourceOptions } from '@config/orm.config';

import {
  databaseServiceMock,
  openaiServiceMock,
  testModuleBootstrapper,
} from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

const language = 'en';
const databaseInfo = 'This is the database information';
const history = [
  {
    id: 1,
    sender: 'user',
    text: 'I would like to know the number of users in the database',
  },
  { id: 2, sender: 'bot', text: 'This is the database information' },
];

describe('db Module', () => {
  let app: INestApplication;

  const adminToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000X',
  });

  beforeAll(async () => {
    await loadFixtures(`${__dirname}/fixture`, datasourceOptions);
    const moduleRef = await testModuleBootstrapper();
    app = moduleRef.createNestApplication({ logger: false });
    setupApp(app);
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST LIST TABLES - /chat/send', () => {
    it('should return a list of tables in the database', async () => {
      const message =
        'I would like to know the existing tables in the database';

      openaiServiceMock.sendMessage.mockResolvedValueOnce({
        response: 'Tables: book, genre, user',
        isSqlQuery: false,
      });

      openaiServiceMock.generateFormalResponse.mockResolvedValueOnce(
        'The existing tables in the database are: book, genre, user',
      );

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message, language, databaseInfo, history })
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body).toHaveProperty('response');
          expect(body).toEqual({
            response:
              'The existing tables in the database are: book, genre, user',
          });
        });
    });
  });

  describe('POST COUNT USERS - /chat/send', () => {
    it('should return the correct count of users in the database', async () => {
      const message =
        'I would like to know the number of users in the database';

      openaiServiceMock.sendMessage.mockResolvedValueOnce({
        response: 'SELECT COUNT(*) FROM users;',
        isSqlQuery: true,
      });

      databaseServiceMock.executeQuery.mockResolvedValueOnce(23);

      openaiServiceMock.generateFormalResponse.mockResolvedValueOnce(
        'The number of users in the database is: 23',
      );

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message, language, databaseInfo, history })
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body).toHaveProperty('response');
          expect(body).toEqual({
            response: 'The number of users in the database is: 23',
          });
        });
    });
  });

  describe('POST - /chat/send - Data modification protection', () => {
    it('should reject requests that attempt to modify data', async () => {
      const message = 'I would like to delete the user with id 1';

      openaiServiceMock.sendMessage.mockResolvedValueOnce({
        response: 'It is not possible to perform data modification operations',
        isSqlQuery: false,
      });

      openaiServiceMock.generateFormalResponse.mockResolvedValueOnce(
        'It is not possible to perform data modification operations',
      );

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message, language, databaseInfo, history })
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body).toHaveProperty('response');
          expect(body).toEqual({
            response:
              'It is not possible to perform data modification operations',
          });
        });
    });
  });

  describe('POST UNAUTHORIZED - /chat/send', () => {
    it('should throw an error if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/database')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
