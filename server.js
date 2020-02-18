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
    const query = db('accounts');

    if (req.query.limit) {
      query.limit(req.query.limit);
    }

    if (req.query.sortby) {
      query.orderBy(
        req.query.sortby, 
        req.query.sortdir 
      );
    }

    res.status(200).json(await query);
  }
  catch (err) {
    res.status(500).json({ error: `Failed to get list of accounts. ${err.message}` });
  }
});

// ACCOUNT BY ID
router.get('/:id', async (req, res) => {
  try {
    res.status(200).json(await getById(req.params.id));
  }
  catch (err) {
    res.status(500).json({ error: `Failed to get account. ${err.message}`})
  }
});

// ADD ACCOUNT
router.post('/', async (req, res) => {
  try {
    const addedIds = await db('accounts').insert(req.body);

    return getById(addedIds[0]).then(account => {
      res.status(201).json(account);
    });
  }
  catch (err) {
    res.status(500).json({ error: `Failed to add post. ${err.message}`})
  }
});

// UPDATE ACCOUNT
router.put('/:id', async (req, res) => {
  try {
    await db('accounts').where({ id: req.params.id }).update(req.body);

    return getById(req.params.id).then(account => {
      res.status(200).json(account);
    });
  }
  catch (err) {
    res.status(500).json({ error: `Failed to update post. ${err.message}` });
  }
});

// DELETE ACCOUNT
router.delete('/:id', async (req, res) => {
  try {
    await db('accounts').where('id', req.params.id).del(); // key/value syntax
    
    return db('accounts').then(accounts => res.status(200).json(accounts));
  }
  catch (err) {
    res.status(500).json({ error: `Failed to delete account. ${err.message}` });
  }
});

function getById(givenId) {
  return db('accounts')
    .where({ id: givenId })
    .first();
}

module.exports = server;