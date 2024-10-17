const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const Todo = require('../models/Todo');
const router = express.Router();

// @route   POST api/todos
// @desc    Create a new To-Do
// @access  Private
router.post(
  '/',
  [auth, [check('subject', 'Subject is required').not().isEmpty(), check('description', 'Description is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, description } = req.body;

    try {
      const lastTodo = await Todo.findOne().sort({ created_at: -1 });
      const newActivityNo = lastTodo ? `AC-${(parseInt(lastTodo.activity_no.split('-')[1]) + 1).toString().padStart(4, '0')}` : 'AC-0001';

      const newTodo = new Todo({
        activity_no: newActivityNo,
        subject,
        description,
        user_id: req.user.id,
      });

      const todo = await newTodo.save();

      res.json(todo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/todos
// @desc    Get all user To-Do activities
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // const todos = await Todo.find({ user_id: req.user.id }).sort({ created_at: -1 });
    const todos = await Todo.find().lean();
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/todos
// @desc    Get all user To-Do activities
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user_id: req.user.id }).sort({ created_at: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/todos/:id
// @desc    Update a To-Do activity
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { subject, description, status } = req.body;

  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ msg: 'To-Do activity not found' });
    }

    if (todo.user_id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (todo.status === 'Unmarked') {
      todo.subject = subject || todo.subject;
      todo.description = description || todo.description;
    }

    if (status) {
      todo.status = status;
    }

    await todo.save();

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/todos/:id
// @desc    Delete a To-Do activity
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ msg: 'To-Do activity not found' });
    }

    if (todo.user_id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (todo.status === 'Unmarked') {
      await todo.remove();
    }

    res.json({ msg: 'To-Do activity removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
