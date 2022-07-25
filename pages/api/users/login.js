import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import client from '../../../utils/client';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  const user = await client.fetch(`*[_type == "user" && email == $email][0]`, {
    email: req.body.email,
  });

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    return res.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  }
  return res.status(401).json({ message: 'Invalid email or password' });
});

export default handler;