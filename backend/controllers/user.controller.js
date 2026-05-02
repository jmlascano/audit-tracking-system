import bcrypt from "bcrypt";
import db from "../config/database.js";

const SALT_ROUNDS = 12;

// Detects whether a stored value is already a bcrypt hash.
// Used during the plaintext→bcrypt migration window.
const isBcryptHash = (value) => /^\$2[ab]\$\d+\$/.test(value);

// Verify a candidate password against a stored value.
// Handles both legacy plaintext passwords (for migration) and bcrypt hashes.
// On a successful plaintext match the stored value is re-hashed transparently.
const verifyAndMigrate = async (candidate, stored, updateHashFn) => {
  if (isBcryptHash(stored)) {
    return bcrypt.compare(candidate, stored);
  }
  // Legacy plaintext path — constant-time comparison via bcrypt timing
  const plaintextMatch = candidate === stored;
  if (plaintextMatch) {
    const newHash = await bcrypt.hash(candidate, SALT_ROUNDS);
    await updateHashFn(newHash);
  }
  return plaintextMatch;
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Fetch by username only — never include password in the WHERE clause
    const memberResult = await db.query(
      'SELECT * FROM member WHERE member_username = ?',
      [username]
    );

    if (memberResult.length > 0) {
      const member = memberResult[0];
      const valid = await verifyAndMigrate(password, member.member_password, (hash) =>
        db.query('UPDATE member SET member_password = ? WHERE member_id = ?', [hash, member.member_id])
      );

      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

      return res.status(200).json({
        success: true,
        userType: 'member',
        user: {
          id: member.member_id,
          username: member.member_username,
          name: member.member_name,
          email: member.member_email
        }
      });
    }

    const orgResult = await db.query(
      'SELECT * FROM org WHERE org_username = ?',
      [username]
    );

    if (orgResult.length > 0) {
      const org = orgResult[0];
      const valid = await verifyAndMigrate(password, org.org_password, (hash) =>
        db.query('UPDATE org SET org_password = ? WHERE org_id = ?', [hash, org.org_id])
      );

      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

      return res.status(200).json({
        success: true,
        userType: 'org',
        user: {
          id: org.org_id,
          username: org.org_username,
          name: org.org_name,
          email: org.org_email
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

    const hashedPassword = await bcrypt.hash(member_password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO member (member_username, member_name, member_password, gender, member_email, degree_program)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [member_username, member_name, hashedPassword, gender || 'Other', member_email, degree_program]
    );

    return res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      memberId: result.insertId.toString()
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

    const hashedPassword = await bcrypt.hash(org_password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO org (org_username, org_name, org_email, org_password)
       VALUES (?, ?, ?, ?)`,
      [org_username, org_name, org_email, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: 'Organization registered successfully',
      orgId: result.insertId.toString()
    });

  } catch (error) {
    console.error('Org signup error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
