module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/setupTests.js'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  transformIgnorePatterns: [
    '/node_modules/(?!chess.js|chessboardjsx|tesseract.js|@react-leaflet|react-leaflet)'
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    'node_modules/chess.js/.+\\.(j|t)sx?$': 'babel-jest'
  }
};