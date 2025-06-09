const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || '24a3e89a7e8ed59ce6d0039735eb140d006697f10d2f8723058b294b67c00256019d5ac63cbb30af78f078a531a65a2bb8748fe22028c9fdeb3b2b333022085b', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;