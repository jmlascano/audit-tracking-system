import { getOrgFees, addOrgFee, updateOrgFeeDue, deleteOrgFee, getOrgFeeStats } from "../controllers/orgFee.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const orgFeeRouter = (app) => {
  app.get("/orgs/:orgId/fees", requireAuth, getOrgFees);
  app.post("/orgs/:orgId/fees", requireAuth, addOrgFee);
  app.put("/orgs/:orgId/fees/:feeId", requireAuth, updateOrgFeeDue);
  app.delete("/orgs/:orgId/fees/:feeId", requireAuth, deleteOrgFee);
  app.get("/orgs/:orgId/fees/stats", requireAuth, getOrgFeeStats);
};