import { getAllOrgs, searchAndFilterMembers, addMemberToOrg, updateMemberOrgStatus, removeMemberFromOrg, getOrgMemberStats } from "../controllers/orgMember.controller.js";

export const orgMemberRouter = (app) => {
  app.get("/orgs", getAllOrgs);
  app.get("/orgs/:orgId/members", searchAndFilterMembers);
  app.post("/orgs/:orgId/members", addMemberToOrg);
  app.put("/orgs/:orgId/members/:memberId", updateMemberOrgStatus);
  app.delete("/orgs/:orgId/members/:memberId", removeMemberFromOrg);
  app.get("/orgs/:orgId/members/stats", getOrgMemberStats);
}