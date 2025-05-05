const express = require('express');
const router = express.Router()
const LLMController = require("../controller/llmController")

router.post('/sendRequest',LLMController.sendRequest)


module.exports = router;