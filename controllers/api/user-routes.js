const router = require('express').Router();
const { User } = require('../../models');


// Register a user
router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Login a user 
router.post('/login', async (req, res)=>{
  try {
    const user = await User.findOne({
      where: {username: req.body.username}
    })
    res.status(200).json(user)
  } catch (err) {
    res.status(401).json(err)
  }
})

router.get('/login', async (req, res)=>{
    res.status(200).render('login')

})

router.get('/register', async (req, res)=>{
  res.status(200).render('register')

})

module.exports = router;
