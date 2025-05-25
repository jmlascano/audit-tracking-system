import { getAllOrgs, getMembersByOrg, addMemberToOrg } from "../controllers/orgMember.controller.js";

export const orgMemberRouter = (app) => {
  app.get("/orgs", getAllOrgs);
  app.get("/orgs/:orgId/members", getMembersByOrg);
  app.post("/orgs/:orgId/members", addMemberToOrg);
}