import db from "../config/database.js";

// Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user exists in member table
    const memberQuery = 'SELECT * FROM member WHERE member_username = ? AND member_password = ?';
    const memberResult = await db.query(memberQuery, [username, password]);

    if (memberResult.length > 0) {
      return res.status(200).json({
        success: true,
        userType: 'member',
        user: {
          id: memberResult[0].member_id,
          username: memberResult[0].member_username,
          name: memberResult[0].member_name,
          email: memberResult[0].member_email
        }
      });
    }

    // Check if user exists in org table
    const orgQuery = 'SELECT * FROM org WHERE org_username = ? AND org_password = ?';
    const orgResult = await db.query(orgQuery, [username, password]);

    if (orgResult.length > 0) {
      return res.status(200).json({
        success: true,
        userType: 'org',
        user: {
          id: orgResult[0].org_id,
          username: orgResult[0].org_username,
          name: orgResult[0].org_name,
          email: orgResult[0].org_email
        }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Signup Member
export const signupMember = async (req, res) => {
  try {
    const {
      member_email,
      member_username,
      member_password,
      member_name,
      degree_program,
      gender
    } = req.body;

    if (!member_email || !member_username || !member_password || !member_name) {
      return res.status(400).json({ error: 'Required fields: member_email, member_username, member_password, member_name' });
    }

    const insertQuery = `
      INSERT INTO member (member_username, member_name, member_password, gender, member_email, degree_program)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(insertQuery, [
      member_username,
      member_name,
      member_password,
      gender || 'Other',
      member_email,
      degree_program
    ]);

    return res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      memberId: result.insertId
    });

  } catch (error) {
    console.error('Member signup error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Signup Organization
export const signupOrg = async (req, res) => {
  try {
    const {
      org_email,
      org_username,
      org_password,
      org_name
    } = req.body;

    if (!org_email || !org_username || !org_password || !org_name) {
      return res.status(400).json({ error: 'All fields are required: org_email, org_username, org_password, org_name' });
    }

    const insertQuery = `
      INSERT INTO org (org_username, org_name, org_email, org_password)
      VALUES (?, ?, ?, ?)
    `;

    const result = await db.query(insertQuery, [
      org_username,
      org_name,
      org_email,
      org_password
    ]);

    return res.status(201).json({
      success: true,
      message: 'Organization registered successfully',
      orgId: result.insertId.toString
    });

  } catch (error) {
    console.error('Org signup error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};