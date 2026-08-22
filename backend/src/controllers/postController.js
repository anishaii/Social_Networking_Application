import Post from '../models/postModel.js';

export const createPost = async (req, res) => {
  const { content } = req.body;

  try {
    const newPost = await Post.create({
      content,
      author: req.userId,
      image: req.file ? req.file.filename : "",
    });

    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username profilePicture');

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture');

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  const { content } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    post.content = content;
    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (userId) => userId.toString() === req.userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== req.userId
      );
    } else {
      post.likes.push(req.userId);
    }

    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ text, author: req.userId });

    await post.save();

    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};