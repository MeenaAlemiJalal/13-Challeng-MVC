const router = require('express').Router();
const authenticate = require('./authentication')
const { Post, User, PostComment } = require('../../models');

// For the `/posts` route

// get all posts
router.get('/', async (req, res) => {
  try{
    const posts = await Post.findAll({
      include:[{ model: User, attributes:['id', 'username'] }],
      raw: true,
      nest: true
    })
    res.status(200).render('home', {posts: posts, userId: req.session.userId})
  }catch(err){
    res.status(500).json(err.message)
  }
});

// get all posts for a user
router.get('/dashboard', async (req, res) => {
  if(!req.session.user) {
    res.redirect('/users/login')
  } else {
    try{
      const posts = await Post.findAll({
        where: {
          owner: req.session.userId
        },
        include:[{ model: User, attributes:['id', 'username'] }],
        raw: true,
        nest: true
      })
      res.status(200).render('dashboard', {posts: posts, userId: req.session.userId})
    }catch(error){
      res.status(500).json(error)
    }
  }
});

// get one post by id with its comments
router.get('/details/:id', async (req, res) => {
  try{
    const post = await Post.findOne({
      where: {
        id: req.params.id
      },
      include:[
        {model: User, attributes: ['id', 'username']},
        {model: PostComment, as: 'comments'}
      ],
    })
    res.status(200).render('postDetails', {post: post.toJSON(), userId: req.session.userId})
  }catch(error){
    res.status(500).json(error.message)
  }
});

// create one post's view 
router.get('/create', authenticate, async (req, res) => {
  try{
    res.status(200).render('create-post', {userId: req.session.userId})
  }catch(err){
    res.status(500).json(err.message)
  }
});

// create one post
router.post('/', authenticate, async (req, res) => {
  try{
    await Post.create({
      title: req.body.title,
      text: req.body.text,
      owner: req.session.userId
    })
    res.status(200).redirect('/posts')
  }catch(err){
    res.status(500).json(err.message)
  }
});


// edit post 
router.get('/edit/:id', authenticate, async (req, res) => {
  try{
    const post = await Post.findOne({
      where: {
        id: req.params.id
      }
    })
    console.log()
    res.status(200).render('update-delete-post', {post: post.toJSON(), userId: req.session.userId})
  }catch(err){
    res.status(500).json(err.message)
  }
});

// this updates one post, using post instead of put as put does not work in forms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
router.post('/edit/:id', authenticate, async (req, res) => {
  try{
    await Post.update(req.body,
      { 
      where:{
        id: req.params.id
      }
    })
    res.status(200).redirect('/posts/dashboard')
  }catch(err){
    res.status(500).json(err.message)
  }
});

// delete one post
router.delete('/:id', authenticate, async (req, res) => {
  try{
    const post = await Post.destroy({
      where:{
        id: req.params.id
      },
      cascade: true
    })
    res.status(200).json(post)
  }catch(err){
    res.status(500).json(err.message)
  }
});


// create one comment to a post
router.post('/:id', authenticate, async (req, res) => {
  try{
    await PostComment.create({
      text: req.body.text,
      owner: req.session.userId,
      related_post: req.params.id
    })
    res.status(200).redirect(`/posts/details/${req.params.id}`)
  }catch(err){
    res.status(500).json(err.message)
  }
});

module.exports = router;