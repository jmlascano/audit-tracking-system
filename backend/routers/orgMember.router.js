import { getAllOrgs, searchAndFilterMembers, addMemberToOrg, updateMemberOrgStatus, removeMemberFromOrg, getOrgMemberStats, getOrgEvents, editOrg } from "../controllers/orgMember.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const orgMemberRouter = (app) => {
  app.get("/orgs", requireAuth, getAllOrgs);
  app.get("/orgs/:orgId/members", requireAuth, searchAndFilterMembers);
  app.post("/orgs/:orgId/members", requireAuth, addMemberToOrg);
  app.put("/orgs/:orgId/members/:memberId/:acadYear/:acadSem", requireAuth, updateMemberOrgStatus);
  app.delete("/orgs/:orgId/members/:memberId/:acadYear/:acadSem", requireAuth, removeMemberFromOrg);
  app.get("/orgs/:orgId/members/stats", requireAuth, getOrgMemberStats);
  app.get("/orgs/:orgId/events", requireAuth, getOrgEvents);
  app.post("/orgs/:orgId", requireAuth, editOrg);
}