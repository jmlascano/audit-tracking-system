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

// Search and Filter Members
export const searchAndFilterMembers = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { 
      semesters, // TODO: Figure out past N semesters filter
      q, 
      status,
      gender,
      committee_role,
      degree_program,
      batch,
      acad_year,
      acad_sem
    } = req.query;

    let baseQuery = `
      SELECT m.*, mpo.batch, mpo.acad_year, mpo.acad_sem, mpo.committee_role, mpo.status
      FROM member m
      JOIN member_part_of_org mpo ON m.member_id = mpo.member_id
      WHERE mpo.org_id = ?
    `;
    
    const queryParams = [orgId];
    
    // Add search conditions if search term exists
    if (q) {
      baseQuery += ` AND (
        m.member_name LIKE ? OR 
        m.member_username LIKE ? OR 
        m.member_email LIKE ?
      )`;
      const searchTerm = `%${q}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Add filter conditions
    const filterConditions = [];
    
    if (status && status !== 'All') {
      filterConditions.push('mpo.status = ?');
      queryParams.push(status);
    }
    
    if (gender && gender !== 'All') {
      filterConditions.push('m.gender = ?');
      queryParams.push(gender);
    }
    
    if (committee_role) {
      filterConditions.push('mpo.committee_role LIKE ?');
      queryParams.push(`%${committee_role}%`);
    }
    
    if (degree_program) {
      filterConditions.push('m.degree_program LIKE ?');
      queryParams.push(`%${degree_program}%`);
    }
    
    if (batch) {
      filterConditions.push('mpo.batch LIKE ?');
      queryParams.push(`%${batch}%`);
    }
    
    if (acad_year) {
      filterConditions.push('mpo.acad_year = ?');
      queryParams.push(acad_year);
    }
    
    if (acad_sem && acad_sem !== 'All') {
      filterConditions.push('mpo.acad_sem = ?');
      queryParams.push(acad_sem);
    }
    
    if (filterConditions.length > 0) {
      baseQuery += ' AND ' + filterConditions.join(' AND ');
    }
    
    // Add sorting
    baseQuery += ' ORDER BY mpo.acad_year DESC, mpo.acad_sem DESC';
    
    const result = await db.query(baseQuery, queryParams);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Search/filter members error:', error);
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

// Remove Member from Organization
export const removeMemberFromOrg = async (req, res) => {
  try {
    const { orgId, memberId } = req.params;

    const deleteQuery = 'DELETE FROM member_part_of_org WHERE member_id = ? AND org_id = ?';
    const result = await db.query(deleteQuery, [memberId, orgId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Member not found in organization' });
    }

    return res.status(200).json({
      success: true,
      message: 'Member remoed from organization successfully'
    });

  } catch (error) {
    console.error('Remove member from org error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};