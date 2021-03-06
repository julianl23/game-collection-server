import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './model';

export async function hashPassword(pw) {
  const password = pw;
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

export const getToken = id => {
  return jwt.sign(
    {
      id: id
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyCredentials = async ({ email, password }) => {
  const user = await User.findOne({
    email
  });

  if (user) {
    const passwordIsValid = await new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) reject(err);
        resolve(isValid);
      });
    });

    return passwordIsValid ? user : passwordIsValid;
  } else {
    return false;
  }
};
