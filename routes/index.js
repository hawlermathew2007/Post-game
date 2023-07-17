const express = require('express')
const router = express.Router() // allow us to create route

router.get('/', (req, res) => {
    res.render('index.ejs')
})

module.exports = router