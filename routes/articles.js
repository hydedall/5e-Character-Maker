const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('In journalEntries')
})

module.exports = router