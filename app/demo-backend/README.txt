npm init -y
to create package.json

create a src folder and create the starting point of the project
server.js

install express library
npm install express

install nodemon
npm install nodemon --save-dev

install prisma
npm install prisma --save-dev
npx prisma init
npm install @prisma/client


install env
npm install  dotenv

npm i --save-dev @types/node

migrate table
npx prisma migrate dev --name add_users_table
npx prisma generate