import jwt from 'jsonwebtoken';

const signToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const checkAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // BEARER XXX
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).json({ message: 'Token is not valid' });
      } else {
        req.user = decode;
        next();
      }
    });
  }else {
    res.status(401).json({ message: 'Token is not suppiled' });
  }
};

export { signToken, checkAuth };
