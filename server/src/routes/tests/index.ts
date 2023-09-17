import Database from "../../models/database";

const express = require('express');

const db = new Database("./src/database/data.pck");
const router = express.Router();

router.get('/', async (req: any, res: any) => {;
    db.set('user1', { name: 'Alice', age: 30 })
    res.send(db.get('user1'));
});

module.exports = router;