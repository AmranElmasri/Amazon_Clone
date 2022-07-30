import nc from 'next-connect';
import { checkAuth } from '../../../utils/auth';

const handler = nc();
handler.use(checkAuth);

handler.get(async (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

export default handler;