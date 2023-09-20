import db from "../../models/database";

const express = require('express');
const router = express.Router();

router.get('/', async (req: any, res: any) => {
    try {
        console.log(0);

        await db.set({
            user1: {
                name: 'Alice',
                age: 30
            }
        });

        console.log(1);
    
        const userData = await db.get();
        res.send(userData);
    } catch (error) {
        // Handle any errors here
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
  
module.exports = router;