const { Pool } = require('pg');
const { query } = require('express');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const pool = new Pool();

module.exports = {

    client: pool,

    async query(...params){

        console.count('Req SQL n°');
        console.log('SQL: ', ...params);
        return await this.client.query(...params);

    }
};