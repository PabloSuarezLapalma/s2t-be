import { GeminiService } from './gemini.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn()
  };
});

describe('GeminiService', () => {
  const originalEnv = process.env;

  let mockGenerateContentStream: jest.Mock;
  let mockGetGenerativeModel: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      GOOGLE_AI_STUDIO_API_KEY: 'dummy-key',
      GOOGLE_AI_MODEL: 'gemini-1.5-flash'
    };

    mockGenerateContentStream = jest.fn();
    mockGetGenerativeModel = jest.fn().mockReturnValue({
      generateContentStream: mockGenerateContentStream
    });
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel
    }));
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  test('should throw error if GOOGLE_AI_STUDIO_API_KEY is missing', async () => {
    delete process.env.GOOGLE_AI_STUDIO_API_KEY;
    const service = new GeminiService();
    const generator = service.generateAIContent('Test prompt');
    await expect(generator.next()).rejects.toThrow(
      'Missing GOOGLE_AI_STUDIO_API_KEY'
    );
  });

  test('should yield AI content chunks from generateContentStream', async () => {
    const dummyChunks = [{ text: () => 'chunk1' }, { text: () => 'chunk2' }];
    // Create an async iterable to mimic the stream
    const streamAsyncIterable = {
      async *[Symbol.asyncIterator]() {
        for (const chunk of dummyChunks) {
          yield chunk;
        }
      }
    };
    mockGenerateContentStream.mockResolvedValue({
      stream: streamAsyncIterable
    });

    const service = new GeminiService();
    const generator = service.generateAIContent('Test prompt');

    const results: string[] = [];
    for await (const textChunk of generator) {
      results.push(textChunk);
    }
    expect(results).toEqual(['chunk1', 'chunk2']);
    expect(GoogleGenerativeAI).toHaveBeenCalledWith('dummy-key');
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({
      model: 'gemini-1.5-flash'
    });
    expect(mockGenerateContentStream).toHaveBeenCalledWith('Test prompt');
  });

  test('should throw internal server error if generateContentStream throws error', async () => {
    mockGenerateContentStream.mockRejectedValue(new Error('Stream failure'));

    const service = new GeminiService();
    const generator = service.generateAIContent('Test prompt');
    await expect(generator.next()).rejects.toThrow('Internal server error');
  });
});
