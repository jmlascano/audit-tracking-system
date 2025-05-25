import { loginUser, signupMember, signupOrg } from "../controllers/user.controller.js";

export const userRouter = (app) => {
  app.post("/login", loginUser);
  app.post("/signup/orgs", signupOrg);
  app.post("/signup/members", signupMember);
}