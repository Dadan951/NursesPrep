module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 60000,
  // mongodb-memory-server peut mettre du temps au premier lancement (téléchargement du binaire)
};
