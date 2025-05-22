export default {
  preset: 'default',
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'jest': true
  },
  transform: {},
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};