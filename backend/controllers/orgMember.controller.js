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
    const { semesters, acad_year, acad_sem, status, batch, committee_role, degree_program, gender } = req.query; // TODO: Figure out past N semesters filter 

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
    if (gender) {
      query += ' AND m.gender = ?';
      params.push(gender);
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

// Add Member to Organization
export const addMemberToOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { member_username, batch, acad_year, acad_sem, committee_role, status } = req.body;

    if (!member_username || !batch || !acad_year || !acad_sem || !committee_role || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get member_id from username
    const memberQuery = 'SELECT member_id FROM member WHERE member_username = ?';
    const memberResult = await db.query(memberQuery, [member_username]);

    if (memberResult.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const member_id = memberResult[0].member_id;

    const insertQuery = `
      INSERT INTO member_part_of_org (member_id, org_id, batch, acad_year, acad_sem, committee_role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(insertQuery, [member_id, orgId, batch, acad_year, acad_sem, committee_role, status]);

    return res.status(201).json({
      success: true,
      message: 'Member added to organization successfully'
    });

  } catch (error) {
    console.error('Add member to org error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Member already exists in organization for this academic period' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Member Organization Status
export const updateMemberOrgStatus = async (req, res) => {
  try {
    const { orgId, memberId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updateQuery = `
      UPDATE member_part_of_org 
      SET status = ? 
      WHERE member_id = ? AND org_id = ?
    `;

    const result = await db.query(updateQuery, [status, memberId, orgId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Member not found in organization' });
    }

    return res.status(200).json({
      success: true,
      message: 'Member status updated successfully'
    });

  } catch (error) {
    console.error('Update member org status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};