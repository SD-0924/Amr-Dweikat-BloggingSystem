module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true, // Optional: speeds up the tests by skipping type-checking
      },
    ],
  },
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transformIgnorePatterns: ["/node_modules/(?!supertest|sequelize)/"],
};
