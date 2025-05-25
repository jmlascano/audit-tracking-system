import { getAllOrgs, getMembersByOrg } from "../controllers/orgMember.controller.js";

export const orgMemberRouter = (app) => {
  app.get("/orgs", getAllOrgs);
  app.get("/orgs/:orgId/members", getMembersByOrg);
}