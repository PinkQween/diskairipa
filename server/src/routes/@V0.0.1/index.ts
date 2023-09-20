const express = require('express');

const router = express.Router();

router.get('/', async (req: any, res: any) => {;
    res.send("test");
});

module.exports = router;