const express = require('express');
const path = require('path');
const router = express.Router();

router.use('/', express.static(path.join(__dirname, '../front-end/dist')))
router.use('/', express.static(path.join(__dirname, '../front-end/')))

module.exports = router;