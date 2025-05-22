import app from '../src/index.js'; 
import axios from 'axios';
import { promises as _promises, existsSync as _existsSync } from 'fs';
import path from 'path';

// Mock OpenAI API
jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [
                {
                  message: {
                    content: 'This is the processed text from OpenAI'
                  }
                }
              ]
            })
          }
        }
      };
    })
  };
});

// Mock file system operations
jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue('File content from disk'),
    readdir: jest.fn().mockResolvedValue(['file1.txt', 'file2.txt'])
  },
  existsSync: jest.fn().mockReturnValue(true)
}));

let server;
const PORT = 4000; // Use a test port
const BASE_URL = `http://localhost:${PORT}`;

beforeAll((done) => {
  server = app.listen(PORT, done);
});

afterAll((done) => {
  server.close(done);
});

describe('Text Editor API Endpoints (axios)', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Text Processing Endpoint', () => {
    it('should process text using OpenAI API - summarize operation', async () => {
      const response = await axios.post(`${BASE_URL}/api/text/process`, {
        text: 'This is a long paragraph that needs to be summarized.',
        operation: 'summarize'
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('processedText');
      expect(response.data.processedText).toBe('This is the processed text from OpenAI');
    });

    it('should process text using OpenAI API - enhance operation', async () => {
      const response = await axios.post(`${BASE_URL}/api/text/process`, {
        text: 'Make this better.',
        operation: 'enhance'
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('processedText');
    });

    it('should process text using OpenAI API - explain operation', async () => {
      const response = await axios.post(`${BASE_URL}/api/text/process`, {
        text: 'What is quantum computing?',
        operation: 'explain'
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('processedText');
    });

    it('should return 400 if text is missing', async () => {
      try {
        await axios.post(`${BASE_URL}/api/text/process`, {
          operation: 'summarize'
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('error');
      }
    });

    it('should return 400 if operation is invalid', async () => {
      try {
        await axios.post(`${BASE_URL}/api/text/process`, {
          text: 'Some text',
          operation: 'invalid-operation'
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('error');
      }
    });
  });

  describe('File Operations Endpoints', () => {
    it('should save file content to disk', async () => {
      const response = await axios.post(`${BASE_URL}/api/file/save`, {
        filename: 'test-file.txt',
        content: 'This is the content to save'
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('success', true);
      expect(_promises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('test-file.txt'),
        'This is the content to save',
        'utf8'
      );
    });

    it('should return 400 if filename is missing when saving', async () => {
      try {
        await axios.post(`${BASE_URL}/api/file/save`, {
          content: 'This is the content to save'
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('error');
      }
    });

    it('should open file from disk', async () => {
      const response = await axios.get(`${BASE_URL}/api/file/open`, {
        params: { filename: 'test-file.txt' }
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('content', 'File content from disk');
      expect(_promises.readFile).toHaveBeenCalledWith(
        expect.stringContaining('test-file.txt'),
        'utf8'
      );
    });

    it('should return 400 if filename is missing when opening', async () => {
      try {
        await axios.get(`${BASE_URL}/api/file/open`, { params: {} });
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('error');
      }
    });

    it('should return 404 if file does not exist', async () => {
      _existsSync.mockReturnValueOnce(false);
      try {
        await axios.get(`${BASE_URL}/api/file/open`, {
          params: { filename: 'non-existent-file.txt' }
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty('error');
      }
    });

    it('should list files', async () => {
      const response = await axios.get(`${BASE_URL}/api/file/list`);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('files');
      expect(response.data.files).toEqual(['file1.txt', 'file2.txt']);
      expect(_promises.readdir).toHaveBeenCalled();
    });
  });
});