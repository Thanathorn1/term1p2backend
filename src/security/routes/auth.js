const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// mock user (ชั่วคราว)
const user = {
  id: 1,
  username: 'Thanathorn',
  // password: 6704101332
  passwordHash: bcrypt.hashSync('6704101332', 10),
};

const SECRET = 'SUPER_SECRET_KEY';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

module.exports = router;
