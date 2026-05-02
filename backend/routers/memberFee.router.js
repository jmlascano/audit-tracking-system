import { getAllMembers, getMemberFees, getMemberFeeStats, payFee, editMember } from "../controllers/memberFee.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const memberFeeRouter = (app) => {
  app.get("/members/", requireAuth, getAllMembers);
  app.get("/members/:memberId/fees", requireAuth, getMemberFees);
  app.get("/members/:memberId/fees/stats", requireAuth, getMemberFeeStats);
  app.get("/members/:memberId/fees/:feeId/pay", requireAuth, payFee);
  app.put("/members/:memberId/fees/edit", requireAuth, editMember);
}