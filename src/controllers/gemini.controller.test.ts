import { GeminiController } from './gemini.controller';

describe('GeminiController', () => {
  let geminiService: { generateAIContent: jest.Mock };
  let controller: GeminiController;

  beforeEach(() => {
    geminiService = {
      generateAIContent: jest.fn()
    };
    controller = new GeminiController(geminiService as any);
  });

  it('should stream content successfully', async () => {
    const chunks = ['chunk1', 'chunk2'];

    // Mock an async generator that yields chunks.
    geminiService.generateAIContent.mockReturnValue(
      (async function* () {
        for (const chunk of chunks) {
          yield chunk;
        }
      })()
    );

    // Create a fake response object.
    const write = jest.fn();
    const set = jest.fn();
    const end = jest.fn();
    const res = { write, set, end };

    await controller.answerPrompt({ prompt: 'test prompt' }, res as any);

    expect(set).toHaveBeenCalledWith({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    chunks.forEach((chunk) => {
      expect(write).toHaveBeenCalledWith(chunk);
    });
    expect(end).toHaveBeenCalled();
  });

  it('should handle error during content generation', async () => {
    // Mock an async generator that throws an error.
    geminiService.generateAIContent.mockImplementation(() => {
      return (async function* () {
        throw new Error('Simulated error');
      })();
    });

    const write = jest.fn();
    const set = jest.fn();
    const end = jest.fn();
    const res = { write, set, end };

    await controller.answerPrompt({ prompt: 'test prompt' }, res as any);

    expect(write).toHaveBeenCalledWith('Error occurred');
    expect(end).toHaveBeenCalled();
  });
});
