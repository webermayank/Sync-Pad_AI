const request = require('supertest');
const app = require('../app'); // Your Express application
const fs = require('fs');
const path = require('path');

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

describe('Text Editor API Endpoints', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Text Processing Endpoint', () => {
    it('should process text using OpenAI API - summarize operation', async () => {
      const response = await request(app)
        .post('/api/text/process')
        .send({
          text: 'This is a long paragraph that needs to be summarized.',
          operation: 'summarize'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('processedText');
      expect(response.body.processedText).toBe('This is the processed text from OpenAI');
    });

    it('should process text using OpenAI API - enhance operation', async () => {
      const response = await request(app)
        .post('/api/text/process')
        .send({
          text: 'Make this better.',
          operation: 'enhance'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('processedText');
    });

    it('should process text using OpenAI API - explain operation', async () => {
      const response = await request(app)
        .post('/api/text/process')
        .send({
          text: 'What is quantum computing?',
          operation: 'explain'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('processedText');
    });

    it('should return 400 if text is missing', async () => {
      const response = await request(app)
        .post('/api/text/process')
        .send({
          operation: 'summarize'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if operation is invalid', async () => {
      const response = await request(app)
        .post('/api/text/process')
        .send({
          text: 'Some text',
          operation: 'invalid-operation'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('File Operations Endpoints', () => {
    it('should save file content to disk', async () => {
      const response = await request(app)
        .post('/api/file/save')
        .send({
          filename: 'test-file.txt',
          content: 'This is the content to save'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('test-file.txt'),
        'This is the content to save',
        'utf8'
      );
    });

    it('should return 400 if filename is missing when saving', async () => {
      const response = await request(app)
        .post('/api/file/save')
        .send({
          content: 'This is the content to save'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should open file from disk', async () => {
      const response = await request(app)
        .get('/api/file/open')
        .query({ filename: 'test-file.txt' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('content', 'File content from disk');
      expect(fs.promises.readFile).toHaveBeenCalledWith(
        expect.stringContaining('test-file.txt'),
        'utf8'
      );
    });

    it('should return 400 if filename is missing when opening', async () => {
      const response = await request(app)
        .get('/api/file/open')
        .query({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 if file does not exist', async () => {
      fs.existsSync.mockReturnValueOnce(false);
      
      const response = await request(app)
        .get('/api/file/open')
        .query({ filename: 'non-existent-file.txt' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should list files', async () => {
      const response = await request(app)
        .get('/api/file/list');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('files');
      expect(response.body.files).toEqual(['file1.txt', 'file2.txt']);
      expect(fs.promises.readdir).toHaveBeenCalled();
    });
  });
});