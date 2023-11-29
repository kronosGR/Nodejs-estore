const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '1.0.0',
    title: 'E-commerce API',
    description: 'Documentation for e-commerce APIMy API',
  },
  host: 'localhost:3000',
  definitions: {
    Login: { $email: 'admin@noroff.no', $password: 'P@ssword2023' },
    SignUp: {
      $firsName: 'Admin',
      $lastName: 'Support',
      $username: 'Admin',
      $email: 'admin@noroff.no',
      $password: 'P@ssword2023',
      $address: 'Online',
      $telephone: '911',
      itemsPurchased: 0,
      MembershipId: 3,
      RoleId: 1,
    },
  },
};

const outputFile = './swagger-output.json';
const endpoints = ['./app.js'];

swaggerAutogen(outputFile, endpoints, doc).then(() => {
  require('./bin/www');
});
