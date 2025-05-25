import { orgMemberRouter } from "./orgMember.router.js";
import { userRouter } from "./user.router.js";
import { memberFeeRouter } from "./memberFee.router.js";

export const router = (app) => {
  orgMemberRouter(app);
  userRouter(app);
  memberFeeRouter(app);
};
