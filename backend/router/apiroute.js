const express = require('express');
const router = express.Router()
const llamaController = require("../controller/llamaController")

router.post('/sendRequest',llamaController.sendRequest)


module.exports = router;