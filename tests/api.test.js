// tests/api.test.js
import request from 'supertest';
import app from '../src/index.js';
import { promises as _promises } from 'fs';
import { jest } from '@jest/globals';


// Mock the OpenAI service to avoid real API calls
jest.mock('../src/services/openaiService.js', () => ({
  processTextWithOpenAI: jest.fn().mockResolvedValue('This is the processed text from OpenAI'),
}));

// Mock file system operations
jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue('File content from disk'),
    readdir: jest.fn().mockResolvedValue(['file1.txt', 'file2.txt']),
    stat: jest.fn().mockResolvedValue({ isFile: () => true })
  },
  existsSync: jest.fn().mockReturnValue(true)
}));

describe('Text Editor API Endpoints (supertest)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Text Processing Endpoint', () => {
    it('should process text using OpenAI API - summarize operation', async () => {
      const res = await request(app)
        .post('/api/text/process')
        .send({
          text: 'This is a long paragraph that needs to be summarized.',
          operation: 'summarize'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('processedText');
      expect(res.body.processedText).toBe('This is the processed text from OpenAI');
    });

    it('should process text using OpenAI API - enhance operation', async () => {
      const res = await request(app)
        .post('/api/text/process')
        .send({
          text: 'Make this better.',
          operation: 'enhance'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('processedText');
    });

    it('should process text using OpenAI API - explain operation', async () => {
      const res = await request(app)
        .post('/api/text/process')
        .send({
          text: 'What is quantum computing?',
          operation: 'explain'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('processedText');
    });

    it('should return 400 if text is missing', async () => {
      const res = await request(app)
        .post('/api/text/process')
        .send({
          operation: 'summarize'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if operation is invalid', async () => {
      const res = await request(app)
        .post('/api/text/process')
        .send({
          text: 'Some text',
          operation: 'invalid-operation'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('File Operations Endpoints', () => {
    it('should save file content to disk', async () => {
      const res = await request(app)
        .post('/api/file/save')
        .send({
          filename: 'test-file.txt',
          content: 'This is the content to save'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(_promises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('test-file.txt'),
        'This is the content to save',
        'utf8'
      );
    });

    it('should return 400 if filename is missing when saving', async () => {
      const res = await request(app)
        .post('/api/file/save')
        .send({ content: 'This is the content to save' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should open file from disk', async () => {
      const res = await request(app)
        .get('/api/file/open')
        .query({ filename: 'test-file.txt' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('content', 'File content from disk');
      expect(_promises.readFile).toHaveBeenCalledWith(
        expect.stringContaining('test-file.txt'),
        'utf8'
      );
    });

    it('should return 400 if filename is missing when opening', async () => {
      const res = await request(app)
        .get('/api/file/open')
        .query({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 if file does not exist', async () => {
      const fs = await import('fs');
      fs.existsSync.mockReturnValueOnce(false);

      const res = await request(app)
        .get('/api/file/open')
        .query({ filename: 'non-existent-file.txt' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should list files', async () => {
      const res = await request(app).get('/api/file/list');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('files');
      expect(res.body.files).toEqual(['file1.txt', 'file2.txt']);
    });
  });
});
