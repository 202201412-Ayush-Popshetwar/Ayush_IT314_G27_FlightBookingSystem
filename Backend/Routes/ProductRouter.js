const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();

router.get('/', ensureAuthenticated, (req, res) => {
    console.log('---- logged in user detail ---', req.user);
    res.status(200).json([
        {

            name: "mobile",
            description: "This is a mobile",
            price: 1000,
            productId: 1
            
        },
        {
            name: "tv",
            description: "This is a tv",
            price: 10000,
            productId: 2
        },{
            name: "toy",
            description: "This is a toy",
            price: 100,
            productId: 3
        }
    ])
});

module.exports = router;