import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import config from '../../../utils/config';
import { signToken } from '../../../utils/auth';
import client from '../../../utils/client';

const handler = nc();

handler.post(async (req, res) => {
  const projectId = config.projectId;
  const dataset = config.dataset;
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN; //to create and update in sanity database

  const createMutations = [
    {
      create: {
        _type: 'user',
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        isAdmin: false,
      },
    },
  ]; //create user in sanity database

  const existUser = await client.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email: req.body.email }
  );

  if(existUser){
    return res.status(401).json({message: 'User already exists'}); //if user already exists
  }

  const { data } = await axios.post(
    `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
    { mutations: createMutations },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenWithWriteAccess}`,
      },
    }
  );
  const userId = data.results[0].id;
  const user = {
    _id: userId,
    name: req.body.name,
    email: req.body.email,
    isAdmin: false,
  };

  const token = signToken(user);
  res.status(201).send({ ...user, token });
});

export default handler;
