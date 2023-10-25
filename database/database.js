const { Client } = require('pg')
const credentials = require('./databaseConstants')

//TODO: mention that there can be an improvement made to encrypt data before sending to backend to avoid network sniffers

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