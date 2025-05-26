import { getOrgFees, addOrgFee, updateOrgFeeDue, deleteOrgFee, getOrgFeeStats } from "../controllers/orgFee.controller.js";

export const orgFeeRouter = (app) => {
  app.get("/orgs/:orgId/fees", getOrgFees);
  app.post("/orgs/:orgId/fees", addOrgFee);
  app.put("/orgs/:orgId/fees/:feeId", updateOrgFeeDue);
  app.delete("/orgs/:orgId/fees/:feeId", deleteOrgFee);
  app.get("/orgs/:orgId/fees/stats", getOrgFeeStats);
};