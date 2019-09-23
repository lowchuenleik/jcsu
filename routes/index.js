const express = require('express');
const router = express.Router();

router.get('/temporary', function(req, res, next) {
  res.json({'TESTING':123})
  const count = 222;
  console.log(`HI ${count} SDA`);
});

module.exports = router;