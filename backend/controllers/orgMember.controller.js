import db from "../config/database.js";

// For testing
export const getAllOrgs = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM org`);
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
    const { q, status, gender, committee, role, degree_program, batch, sem_ay } = req.query;

    let paramIndex = 1;
    let baseQuery = `
      SELECT m.*, mpo.batch, mpo.acad_year, mpo.acad_sem, mpo.committee, mpo.status, mpo.role,
        CASE
          WHEN mpo.acad_sem = '1' THEN CONCAT(SUBSTRING(mpo.acad_year,1,2), '-', SUBSTRING(mpo.acad_year,3), ', ', mpo.acad_sem, 'st Sem')
          WHEN mpo.acad_sem = '2' THEN CONCAT(SUBSTRING(mpo.acad_year,1,2), '-', SUBSTRING(mpo.acad_year,3), ', ', mpo.acad_sem, 'nd Sem')
          ELSE CONCAT(SUBSTRING(mpo.acad_year,1,2), '-', SUBSTRING(mpo.acad_year,3), ', ', 'Midyear')
        END sem_ay
      FROM member m
      JOIN member_part_of_org mpo ON m.member_id = mpo.member_id
      WHERE mpo.org_id = $${paramIndex++}
    `;

    const queryParams = [orgId];

    if (q) {
      baseQuery += ` AND m.member_name ILIKE $${paramIndex++}`;
      queryParams.push(`%${q}%`);
    }

    const filterConditions = [];

    if (status && status !== 'All') {
      filterConditions.push(`mpo.status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (gender && gender !== 'All') {
      filterConditions.push(`m.gender = $${paramIndex++}`);
      queryParams.push(gender);
    }

    if (committee) {
      filterConditions.push(`mpo.committee ILIKE $${paramIndex++}`);
      queryParams.push(`%${committee}%`);
    }

    if (role) {
      filterConditions.push(`mpo.role ILIKE $${paramIndex++}`);
      queryParams.push(`%${role}%`);
    }

    if (degree_program) {
      filterConditions.push(`m.degree_program ILIKE $${paramIndex++}`);
      queryParams.push(`%${degree_program}%`);
    }

    if (batch) {
      filterConditions.push(`mpo.batch ILIKE $${paramIndex++}`);
      queryParams.push(`%${batch}%`);
    }

    if (sem_ay) {
      if (!/^\d{2}-\d{2},\s/.test(sem_ay) || sem_ay.length < 8) {
        return res.status(400).json({ error: 'Invalid sem_ay format' });
      }
      const year = sem_ay.substring(0, 2) + sem_ay.substring(3, 5);
      const sem = sem_ay.substring(7, 8);
      filterConditions.push(`mpo.acad_year = $${paramIndex++} AND mpo.acad_sem = $${paramIndex++}`);
      queryParams.push(year, sem);
    }

    if (filterConditions.length > 0) {
      baseQuery += ' AND ' + filterConditions.join(' AND ');
    }

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
    const { member_username, batch, acad_year, acad_sem, committee, role, status } = req.body;

    if (!member_username || !batch || !acad_year || !acad_sem || !committee || !role || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const memberResult = await db.query(
      'SELECT member_id FROM member WHERE member_username = $1',
      [member_username]
    );

    if (memberResult.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const member_id = memberResult[0].member_id;

    await db.query(
      `INSERT INTO member_part_of_org (member_id, org_id, batch, acad_year, acad_sem, committee, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [member_id, orgId, batch, acad_year, acad_sem, committee, role, status]
    );

    return res.status(201).json({ success: true, message: 'Member added to organization successfully' });

  } catch (error) {
    console.error('Add member to org error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Member already exists in organization for this academic period' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Member Organization Status
export const updateMemberOrgStatus = async (req, res) => {
  try {
    const { orgId, memberId, acadYear, acadSem } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await db.query(
      `UPDATE member_part_of_org
       SET status = $1
       WHERE member_id = $2 AND org_id = $3 AND acad_year = $4 AND acad_sem = $5`,
      [status, memberId, orgId, acadYear, acadSem]
    );

    if (Number(result.count) === 0) {
      return res.status(404).json({ error: 'Member not found in organization' });
    }

    return res.status(200).json({ success: true, message: 'Member status updated successfully' });

  } catch (error) {
    console.error('Update member org status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove Member from Organization
export const removeMemberFromOrg = async (req, res) => {
  try {
    const { orgId, memberId, acadYear, acadSem } = req.params;

    const result = await db.query(
      'DELETE FROM member_part_of_org WHERE member_id = $1 AND org_id = $2 AND acad_year = $3 AND acad_sem = $4',
      [memberId, orgId, acadYear, acadSem]
    );

    if (Number(result.count) === 0) {
      return res.status(404).json({ error: 'Member not found in organization' });
    }

    return res.status(200).json({ success: true, message: 'Member removed from organization successfully' });

  } catch (error) {
    console.error('Remove member from org error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Organization Member Statistics
export const getOrgMemberStats = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { n } = req.query;

    let paramIndex = 1;
    let query = `
      SELECT
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status != 'Active' THEN 1 END) as inactive_count,
        COUNT(*) as total_count
      FROM member_part_of_org
      WHERE org_id = $${paramIndex++}
    `;

    const queryParams = [orgId];

    if (n && !isNaN(n) && parseInt(n) > 0) {
      const currentYear = 2425;
      const currentSem = '2';

      const semesters = [];
      let year = currentYear;
      let sem = currentSem;

      for (let i = 0; i < parseInt(n); i++) {
        semesters.push({ year, sem });
        if (sem === '1') {
          year = year - 101;
          sem = 'm';
        } else if (sem === 'm') {
          sem = '2';
        } else if (sem === '2') {
          sem = '1';
        }
      }

      const semesterConditions = semesters
        .map(() => `(acad_year = $${paramIndex++} AND acad_sem = $${paramIndex++})`)
        .join(' OR ');
      query += ` AND (${semesterConditions})`;

      semesters.forEach(s => queryParams.push(s.year, s.sem));
    }

    const result = await db.query(query, queryParams);

    const stats = result[0];
    const activeCount = Number(stats.active_count) || 0;
    const inactiveCount = Number(stats.inactive_count) || 0;
    const totalCount = Number(stats.total_count) || 0;

    const activePercentage = totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(2) : 0;
    const inactivePercentage = totalCount > 0 ? ((inactiveCount / totalCount) * 100).toFixed(2) : 0;

    return res.status(200).json({
      active_count: activeCount,
      inactive_count: inactiveCount,
      total_count: totalCount,
      active_percentage: parseFloat(activePercentage),
      inactive_percentage: parseFloat(inactivePercentage)
    });

  } catch (error) {
    console.error('Get org member stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Organization Events
export const getOrgEvents = async (req, res) => {
  try {
    const { orgId } = req.params;

    const result = await db.query(
      'SELECT event FROM org_event WHERE org_id = $1',
      [orgId]
    );

    const events = result.map(row => row.event);
    return res.status(200).json(events);

  } catch (error) {
    console.error('Get org events error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Edit Organization Details
export const editOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { org_name } = req.body;

    if (!org_name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    await db.query(
      `UPDATE org SET org_name = $1 WHERE org_id = $2`,
      [org_name, orgId]
    );

    return res.status(201).json({ success: true, message: 'Edit of organization success' });

  } catch (error) {
    console.error('Edit org error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
