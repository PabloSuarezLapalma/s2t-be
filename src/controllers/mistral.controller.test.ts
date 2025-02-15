import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MistralController } from './mistral.controller';
import { MistralService } from '../services/mistral.service';

describe('MistralController', () => {
  let app: INestApplication;
  let mistralService: MistralService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MistralController],
      providers: [
        {
          provide: MistralService,
          useValue: {
            answerPrompt: jest.fn((body, res) => {
              res.status(200).json({ message: 'ok' });
            })
          }
        }
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    mistralService = moduleRef.get<MistralService>(MistralService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /mistral/prompt', () => {
    it('should call answerPrompt on MistralService and return expected response', async () => {
      const promptText = 'Test prompt';
      const response = await request(app.getHttpServer())
        .post('/mistral/prompt')
        .send({ prompt: promptText });

      expect(mistralService.answerPrompt).toHaveBeenCalledWith(
        { prompt: promptText },
        expect.any(Object)
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'ok' });
    });
  });
});
