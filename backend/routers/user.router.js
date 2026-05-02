import { signupMember, signupOrg, getCurrentUser } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const userRouter = (app) => {
  app.post('/signup/orgs', signupOrg);
  app.post('/signup/members', signupMember);
  app.get('/me', requireAuth, getCurrentUser);
};