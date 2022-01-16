const router = require('express').Router();
const { raw } = require('body-parser');
const { Post, User, PostComment } = require('../../models');

// Fro the `/blogs` route

// get all posts
router.get('/', async (req, res) => {
  try{
    const posts = await Post.findAll({
      include:[{ model: User, attributes:['id', 'username'] }],
      raw: true,
      nest: true
    })
    res.status(200).render('home', {posts: posts})
  }catch(err){
    res.status(500).json(err.message)
  }
});

// get all posts for a user
router.get('/dashboard', async (req, res) => {
  try{
    const posts = await Post.findAll({
      where: {
        owner: 1
      },
      include:[{ model: User, attributes:['id', 'username'] }],
      raw: true,
      nest: true
    })
    res.status(200).render('dashboard', {posts: posts})
  }catch(error){
    res.status(500).json(error)
  }
});

// get one post by id with its comments
router.get('/:id', async (req, res) => {
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
    res.status(200).render('postDetails', {post: post.toJSON()})
  }catch(error){
    res.status(500).json(error.message)
  }
});

// create one post
router.post('/', async (req, res) => {
  try{
    const post = await Post.create({
      title: req.body.title,
      text: req.body.text,
      owner: 1
    })
    res.status(200).json(post)
  }catch(err){
    res.status(500).json(err.message)
  }
});

// update one post                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
router.put('/:id', async (req, res) => {
  try{
    const post = await Post.update(req.body,
      { 
      where:{
        id: req.params.id
      }
    })
    res.status(200).json(post)
  }catch(err){
    res.status(500).json(err.message)
  }
});

// delete one post
router.delete('/:id', async (req, res) => {
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
router.post('/:id', async (req, res) => {
  try{
    const post = await PostComment.create({
      text: req.body.text,
      owner: 1,
      related_post: 2
    })
    res.status(200).json(post)
  }catch(err){
    res.status(500).json(err.message)
  }
});

module.exports = router;