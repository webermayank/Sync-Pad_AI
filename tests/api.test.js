import { jest } from '@jest/globals';

// Create mock functions that will be used in the fs mock
const mockWriteFile = jest.fn().mockResolvedValue(undefined);
const mockReadFile = jest.fn().mockResolvedValue('File content from disk');
const mockReaddir = jest.fn().mockResolvedValue(['file1.txt', 'file2.txt']);
const mockStat = jest.fn().mockResolvedValue({ isFile: () => true });
const mockExistsSync = jest.fn().mockReturnValue(true);

// Mock the OpenAI service to avoid real API calls
jest.mock('../src/services/openaiService.js', () => ({
  processTextWithOpenAI: jest.fn().mockResolvedValue('This is the processed text from OpenAI'),
}));

// More comprehensive fs mocking
const fsMockImplementation = {
  promises: {
    writeFile: mockWriteFile,
    readFile: mockReadFile,
    readdir: mockReaddir,
    stat: mockStat,
    mkdir: jest.fn().mockResolvedValue(undefined),
    access: jest.fn().mockResolvedValue(undefined)
  },
  existsSync: mockExistsSync,
  writeFileSync: jest.fn(),
  readFileSync: jest.fn().mockReturnValue('File content'),
  mkdirSync: jest.fn(),
  constants: {
    F_OK: 0,
    R_OK: 4,
    W_OK: 2,
    X_OK: 1
  }
};

// Mock all possible fs import patterns
jest.mock('fs', () => fsMockImplementation);
jest.mock('fs/promises', () => fsMockImplementation.promises);
jest.mock('node:fs', () => fsMockImplementation);
jest.mock('node:fs/promises', () => fsMockImplementation.promises);

// Also try mocking the specific file that might be importing fs
// You might need to adjust this path based on your project structure
jest.mock('../src/routes/fileRoutes.js', () => {
  const actualModule = jest.requireActual('../src/routes/fileRoutes.js');
  return {
    ...actualModule,
    // Override any fs-related functions here if needed
  };
});

// Import request after all mocks are set up
import request from 'supertest';
// Import the app AFTER mocking
import app from '../src/index.js';

describe('Text Editor API Endpoints (supertest)', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    mockWriteFile.mockClear();
    mockReadFile.mockClear();
    mockReaddir.mockClear();
    mockStat.mockClear();
    mockExistsSync.mockClear();
  });

  describe.skip('Text Processing Endpoint', () => {
    it('should process text using OpenAI API - summarize operation', async () => {
      const res = await request(app)
        .post('/api/text/process')
        .send({
          text: 'Artificial intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn. AI applications include expert systems, natural language processing, and machine vision.',
          operation: 'summarize'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('processedText');
      expect(res.body.processedText).toMatch('Artificial intelligence');
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
          text: 'What is 2+2?',
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
    beforeEach(() => {
      // Clear mocks before each test in this describe block too
      mockWriteFile.mockClear();
      mockReadFile.mockClear();
      mockReaddir.mockClear();
      mockStat.mockClear();
      mockExistsSync.mockClear();
    });
    // afterAll(async () => {
    //   // Clean up test files
    //   try {
    //     const fs = await import('fs');
    //     const path = await import('path');
    //     const testFilePath = path.join(process.cwd(), 'src', 'files', 'test-file.txt');
    //     if (fs.existsSync(testFilePath)) {
    //       fs.unlinkSync(testFilePath);
    //     }
    //   } catch (error) {
    //     // Ignore cleanup errors
    //   }
    // });
    it('should save file content to disk', async () => {
      const res = await request(app)
        .post('/api/file/save')
        .send({
          filename: 'test-file.txt',
          content: 'This is the content to save'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('filename', 'test-file.txt');
      expect(res.body).toHaveProperty('path');
      expect(res.body.path).toContain('test-file.txt');
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
      expect(res.body).toHaveProperty('content');
      // Since the file was saved in the previous test, it should contain the saved content
      expect(res.body.content).toBe('This is the content to save');
    });

    it('should return 400 if filename is missing when opening', async () => {
      const res = await request(app)
        .get('/api/file/open')
        .query({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 if file does not exist', async () => {
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
      expect(Array.isArray(res.body.files)).toBe(true);
      // Since we saved test-file.txt in the earlier test, it should be in the list
      expect(res.body.files).toContain('test-file.txt');
    });
  });
});

// Export the mock functions so they can be used in other test files if needed
export { mockWriteFile, mockReadFile, mockReaddir, mockStat, mockExistsSync };