import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { setupApp } from '@config/app.config';
import { datasourceOptions } from '@config/orm.config';

import { testModuleBootstrapper } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

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

  describe('GET - /database', () => {
    it('should return a success response', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/database')
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            databaseInfo: expect.any(String),
          });

          expect(body).toEqual(expectedResponse);

          const { databaseInfo } = body;
          expect(databaseInfo).toContain('user');
          expect(databaseInfo).toContain('book');
          expect(databaseInfo).toContain('genre');
        });
    });
  });

  describe('GET UNAUTHORIZED - /database', () => {
    it('should throw an error if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/database')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
