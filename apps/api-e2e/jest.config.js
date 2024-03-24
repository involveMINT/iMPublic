module.exports = {
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  coverageDirectory: '../../coverage/apps/api-e2e',
  displayName: 'api-e2e',
  setupFiles: ['<rootDir>/global-mocks.ts'],
  reporters: ['default', ['jest-junit', { outputDirectory: 'reports', outputName: 'api-e2e.xml' }]],
  transformIgnorePatterns: ['node_modules/(?!axios)'],
  moduleNameMapper: {
    axios: 'axios/dist/node/axios.cjs',
  },
};
