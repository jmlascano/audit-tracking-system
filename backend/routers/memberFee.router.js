import { getMemberFees, getMemberFeeStats, payFee } from "../controllers/memberFee.controller.js";

export const memberFeeRouter = (app) => {
  app.get("/members/:memberId/fees", getMemberFees);
  app.get("/members/:memberId/fees/stats", getMemberFeeStats);
  app.get("/members/:memberId/fees/:feeId/pay", payFee);
}