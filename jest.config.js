module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["node_modules", "<rootDir>/src"],
  verbose: false,
  testTimeout: 600000,
  testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
};
