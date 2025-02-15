import { MistralService } from './mistral.service';
import { Mistral } from '@mistralai/mistralai';
import { Response } from 'express';

jest.mock('@mistralai/mistralai');

describe('MistralService', () => {
  let service: MistralService;
  let res: Partial<Response>;
  let setMock: jest.Mock;
  let writeMock: jest.Mock;
  let endMock: jest.Mock;

  // Create a mock for the chat.stream method.
  const mockStream = jest.fn();

  // Fake client that will be returned when Mistral is instantiated.
  const fakeClient = {
    chat: { stream: mockStream }
  };

  beforeEach(() => {
    service = new MistralService();
    setMock = jest.fn();
    writeMock = jest.fn();
    endMock = jest.fn();
    res = {
      set: setMock,
      write: writeMock,
      end: endMock
    };

    jest.clearAllMocks();
    (Mistral as jest.Mock).mockImplementation(() => fakeClient);
  });

  test('should stream response successfully', async () => {
    // Arrange: create an async generator that simulates the API stream.
    async function* asyncGenerator() {
      yield { data: { choices: [{ delta: { content: 'part1' } }] } };
      yield { data: { choices: [{ delta: { content: 'part2' } }] } };
    }
    mockStream.mockReturnValue(asyncGenerator());

    // Act
    await service.answerPrompt({ prompt: 'Hello' }, res as Response);

    // Assert: ensure headers are set and the write calls stream correctly.
    expect(setMock).toHaveBeenCalledWith({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    expect(writeMock).toHaveBeenNthCalledWith(1, 'part1');
    expect(writeMock).toHaveBeenNthCalledWith(2, 'part2');
    expect(endMock).toHaveBeenCalled();
  });

  test('should handle errors during streaming', async () => {
    // Arrange: simulate an error thrown by the stream.
    mockStream.mockRejectedValue(new Error('Stream error'));

    // Act
    await service.answerPrompt({ prompt: 'Hello' }, res as Response);

    // Assert: ensure error message is written and the response is ended.
    expect(writeMock).toHaveBeenCalledWith('Error occurred');
    expect(endMock).toHaveBeenCalled();
  });
});
