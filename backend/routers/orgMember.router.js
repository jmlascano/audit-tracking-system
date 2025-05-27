import { getAllOrgs, searchAndFilterMembers, addMemberToOrg, updateMemberOrgStatus, removeMemberFromOrg, getOrgMemberStats, getOrgEvent, editOrg } from "../controllers/orgMember.controller.js";

export const orgMemberRouter = (app) => {
  app.get("/orgs", getAllOrgs);
  app.get("/orgs/:orgId/members", searchAndFilterMembers);
  app.post("/orgs/:orgId/members", addMemberToOrg);
  app.put("/orgs/:orgId/members/:memberId/:acadYear/:acadSem", updateMemberOrgStatus);
  app.delete("/orgs/:orgId/members/:memberId/:acadYear/:acadSem", removeMemberFromOrg);
  app.get("/orgs/:orgId/members/stats", getOrgMemberStats);
  app.get("/orgs/:orgId/events", getOrgEvents);
  app.post("/orgs/:orgId", editOrg);
}