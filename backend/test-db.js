const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Testing database connection...');
console.log('DB Host:', process.env.DB_HOST);
console.log('DB Port:', process.env.DB_PORT);
console.log('DB Name:', process.env.DB_NAME);
console.log('DB User:', process.env.DB_USERNAME);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log,
  }
);

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

test();