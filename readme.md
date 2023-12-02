# Noroff Back-end Development Year 1

Everything was done by myself and the only thing I looked for were the resources from the class and official documentation of the packages.

## Installation

```
  npm install
  npm start

  // go to /init endpoint to add the initial dat to the database
  http://localhost:3000/init

  // for unit test
  npm test
```

// swagger API documentation http://localhost:3000/doc

// Admin Panel Login Page
http://localhost:3000/

// Credentials

```
Username: Admin
Password: P@ssword2023
Email: admin@noroff.no
```

## .env example

```
HOST="localhost"
ADMIN_USERNAME="estore"
ADMIN_PASSWORD="123456"
DATABASE_NAME="estore"
DIALECT="mysql"
DIALECTMODEL="mysql2"
PORT="3000"
DB_PORT="3306"
TOKEN_SECRET=7b0eab1c341f9b65c6a499d2b291a8e61efaab450ecccc1f6cd1bbea2615b4cd1f078ac57430cd3197c1a7236626b2bd7b34385b993b2b46d0f73e72f5852242
INIT_URL=http://143.42.108.232:8888/items/products

```

## Various Information

- Node.js version - v18.18.0
- Packages used
  - bcrypt
  - bootstrap
  - cookie-parser
  - ejs
  - express
  - express-session
  - http-errors
  - jest
  - jquery
  - jsend
  - jsonwebtoken
  - mysql
  - mysql2
  - sequelize
  - supertest
  - supertext
  - swagger-autogen
  - swagger-ui-express
