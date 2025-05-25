import { getAllOrgs, getMembersByOrg, addMemberToOrg, updateMemberOrgStatus } from "../controllers/orgMember.controller.js";

export const orgMemberRouter = (app) => {
  app.get("/orgs", getAllOrgs);
  app.get("/orgs/:orgId/members", getMembersByOrg);
  app.post("/orgs/:orgId/members", addMemberToOrg);
  app.post("/orgs/:orgId/members", updateMemberOrgStatus);
}