const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

const comparePassword = (password, hashed) => bcrypt.compare(password, hashed);

module.exports = { hashPassword, comparePassword };
