import { getAllMembers } from "../controllers/memberFee.controller.js";

export const memberFeeRouter = (app) => {
  app.get("/members", getAllMembers);
}