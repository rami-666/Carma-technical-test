const { Pool } = require('pg');
const crypto = require('crypto');
const credentials = require('./databaseConstants');
const initDb = require('./database')
const async = require('hbs/lib/async');

initDb();

const pool = new Pool(credentials);
//TODO: mention that these should be placed as environment variables
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); //TODO: put this in a .env file or hard code it
const iv = crypto.randomBytes(16);

const insertData = async(card_number,cvv, card_holder_name, expiration_date) => {
    const query = 'INSERT INTO credit_cards(card_number, cvv, card_holder_name, expiration_date) VALUES(\$1, \$2, \$3, \$4) RETURNING *';
    const values = [encrypt(card_number), encrypt(cvv), card_holder_name, expiration_date];

    try {
        const res = await pool.query(query, values);
        console.log("Data inserted successfully!");
        return res.rows.map(row => ({
            ...row,
            card_number: decrypt(row.card_number),
            cvv: decrypt(row.cvv),
        }));;
    } catch (err) {
        console.error("Error inserting data: ", err);
    }
};

const selectData = async() =>{
    const query = 'SELECT * FROM credit_cards';

    try {
        const res = await pool.query(query);
        console.log("Data selected successfully!");
        return res.rows.map(row => ({
            ...row,
            card_number: decrypt(row.card_number),
            cvv: decrypt(row.cvv),
        }));
    } catch (err) {
        console.error("Error selecting data: ", err);
    }
};


const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
    return decrypted.toString();
}

module.exports = { insertData, selectData };