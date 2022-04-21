const express = require("express");
const router = express.Router();

router.use('/inventory', require('./inventory.controller'));
router.use('/groups', require('./group.controller'));
router.use('/activities', require('./activity.controller'));
router.use('/account', require('./account.controller'));

module.exports = router;
