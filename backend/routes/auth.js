const express = require('express');
const router = express.Router();

// Hardcoded login credentials as requested
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'ELLA' && password === 'HOLI') {
    return res.json({ success: true, username });
  }
  return res.status(401).json({ error: 'invalid credentials' });
});

module.exports = router;
