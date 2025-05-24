import db from "../config/database.js";

// For testing
export const getAllOrgs = async (req, res) => {
  try {
    let query = `
      SELECT * from org;
    `;

    const result = await db.query(query);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Get all orgs error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get Members by Organization
export const getMembersByOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { semesters, acad_year, acad_sem, status, batch, committee_role, degree_program } = req.query; // TODO: Figure out past N semesters filter 

    let query = `
      SELECT m.*, mpo.batch, mpo.acad_year, mpo.acad_sem, mpo.committee_role, mpo.status
      FROM member m
      JOIN member_part_of_org mpo ON m.member_id = mpo.member_id
      WHERE mpo.org_id = ?
    `;
    const params = [orgId];

    // Add filters based on query parameters
    if (acad_year) {
      query += ' AND mpo.acad_year = ?';
      params.push(acad_year);
    }
    if (acad_sem) {
      query += ' AND mpo.acad_sem = ?';
      params.push(acad_sem);
    }
    if (status) {
      query += ' AND mpo.status = ?';
      params.push(status);
    }
    if (batch) {
      query += ' AND mpo.batch = ?';
      params.push(batch);
    }
    if (committee_role) {
      query += ' AND mpo.committee_role = ?';
      params.push(committee_role);
    }
    if (degree_program) {
      query += ' AND m.degree_program = ?';
      params.push(degree_program);
    }

    // Sort current to past
    query += ' ORDER BY mpo.acad_year DESC, mpo.acad_sem DESC';

    const result = await db.query(query, params);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Get members by org error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};