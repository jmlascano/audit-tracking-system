import { getAllMembers, editMember } from "../controllers/memberFee.controller.js";

export const memberFeeRouter = (app) => {
  app.get("/members", getAllMembers);
  app.post("/members/:memberId", editMember);
}