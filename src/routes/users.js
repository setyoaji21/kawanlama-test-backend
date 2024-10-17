const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const decodeJWT = jwt.decode(token, { complete: true });
    const id = decodeJWT.payload.user.id;
    const user = await User.findOne({ _id: id });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

module.exports = router;
