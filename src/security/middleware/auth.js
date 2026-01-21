const jwt = require('jsonwebtoken');
const SECRET = 'SUPER_SECRET_KEY';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
};
