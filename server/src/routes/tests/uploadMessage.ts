const express = require('express');

const router = express.Router();

router.get('/', (req: any, res: any) => {
    res.send("Test")
})

module.exports = router;