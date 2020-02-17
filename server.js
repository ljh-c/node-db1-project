const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

const router = express.Router();

server.use(express.json());

server.get('/', (req, res) => {
  res.send('<h2>DB access using knex</h2>')
});

server.use('/api/accounts', router);

// npx knex seed:run

// LIST OF ACCOUNTS
router.get('/', async (req, res) => {
  try {
    res.status(200).json(await db('accounts'));
  }
  catch (err) {
    res.status(500).json({ error: `Failed to get list of accounts. ${err.message}` });
  }
});

// ACCOUNT BY ID
router.get('/:id', async (req, res) => {
  try {
    res.status(200).json(await db('accounts')
      .where({ id: req.params.id }).first()
    );
  }
  catch (err) {
    res.status(500).json({ error: `Failed to get account. ${err.message}`})
  }
});

module.exports = server;