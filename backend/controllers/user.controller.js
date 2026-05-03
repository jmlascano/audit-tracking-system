import { supabase } from '../config/supabase.js';
import db from '../config/database.js';

export const signupMember = async (req, res) => {
  const { member_email, member_username, member_password, member_name, degree_program, gender } = req.body;

  if (!member_email || !member_username || !member_password || !member_name) {
    return res.status(400).json({ error: 'Required fields: member_email, member_username, member_password, member_name' });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: member_email,
    password: member_password,
    email_confirm: true,
  });

  if (error) {
    if (error.message?.includes('already')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Supabase signup error:', error.status, error.message, error.code);
    return res.status(500).json({ error: 'Internal server error' });
  }

  try {
    const result = await db.query(
      `INSERT INTO member (member_username, member_name, gender, member_email, degree_program)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING member_id`,
      [member_username, member_name, gender || 'Other', member_email, degree_program]
    );

    const member_id = result[0].member_id;

    await db.query(
      `INSERT INTO user_profiles (auth_user_id, user_type, app_user_id) VALUES ($1, $2, $3)`,
      [data.user.id, 'member', member_id]
    );

    return res.status(201).json({ success: true, message: 'Member registered successfully', memberId: member_id });
  } catch (dbError) {
    await supabase.auth.admin.deleteUser(data.user.id);
    console.error('Member signup DB error:', dbError.code, dbError.message);
    if (dbError.code === '23505') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const signupOrg = async (req, res) => {
  const { org_email, org_username, org_password, org_name } = req.body;

  if (!org_email || !org_username || !org_password || !org_name) {
    return res.status(400).json({ error: 'All fields are required: org_email, org_username, org_password, org_name' });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: org_email,
    password: org_password,
    email_confirm: true,
  });

  if (error) {
    if (error.message?.includes('already')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Supabase signup error:', error.status, error.message, error.code);
    return res.status(500).json({ error: 'Internal server error' });
  }

  try {
    const result = await db.query(
      `INSERT INTO org (org_username, org_name, org_email)
       VALUES ($1, $2, $3)
       RETURNING org_id`,
      [org_username, org_name, org_email]
    );

    const org_id = result[0].org_id;

    await db.query(
      `INSERT INTO user_profiles (auth_user_id, user_type, app_user_id) VALUES ($1, $2, $3)`,
      [data.user.id, 'org', org_id]
    );

    return res.status(201).json({ success: true, message: 'Organization registered successfully', orgId: org_id });
  } catch (dbError) {
    await supabase.auth.admin.deleteUser(data.user.id);
    console.error('Org signup DB error:', dbError);
    if (dbError.code === '23505') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const profileRows = await db.query(
      `SELECT user_type, app_user_id FROM user_profiles WHERE auth_user_id = $1`,
      [req.user.id]
    );

    if (!profileRows || profileRows.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const { user_type, app_user_id } = profileRows[0];

    if (user_type === 'member') {
      const rows = await db.query(
        `SELECT member_id AS id, member_username AS username, member_name AS name, member_email AS email
         FROM member WHERE member_id = $1`,
        [app_user_id]
      );
      return res.status(200).json({ userType: 'member', ...rows[0] });
    } else {
      const rows = await db.query(
        `SELECT org_id AS id, org_username AS username, org_name AS name, org_email AS email
         FROM org WHERE org_id = $1`,
        [app_user_id]
      );
      return res.status(200).json({ userType: 'org', ...rows[0] });
    }
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
