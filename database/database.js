const { Client } = require('pg')
const credentials = require('./databaseConstants')

//This module initializes a connection with the postgresql server and creates the credit cards table if needed

const client = new Client(credentials);

const initDb = async () => {
    try {
        await client.connect()
        console.log("Connection to database established!");

        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS credit_cards(
            id SERIAL PRIMARY KEY,
            card_number char(64),
            cvv char(64),
            card_holder_name varchar(255),
            expiration_date varchar(100)
        );
        `;

        await client.query(createTableQuery);
        console.log('Table created successfully!');
    } catch (err) {
        console.error(`Failed to connect ${err}`);
    } finally {
        await client.end();
        console.log("Client disconnected Successfully");
    }
};

module.exports = initDb;