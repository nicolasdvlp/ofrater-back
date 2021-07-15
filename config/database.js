const { Sequelize } = require('sequelize');
const { postgresql } = require('./../config');
// const { query } = require('express');

// console.log(`postgres://${postgresql.user}:${postgresql.password}@${postgresql.host}:5432/${postgresql.database}`)

const sequelize = new Sequelize(`postgres://${postgresql.user}:${postgresql.password}@${postgresql.host}:5432/${postgresql.database}`, {
  define: {
    timestamps: false
  }
});

module.exports = sequelize;

// const { Pool } = require('pg');

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }

// const pool = new Pool();

// module.exports = {
//   // client: pool,
//   async query(...params) {
//     console.count('Req SQL n°');
//     console.log('SQL: ', ...params);
//     return await this.sequelize.query(...params);
//   }
// };