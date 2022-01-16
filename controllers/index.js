const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/', apiRoutes);

router.use((req, res) => {
  res.redirect('/posts')
});

module.exports = router;