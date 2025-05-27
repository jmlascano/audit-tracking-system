import db from "../config/database.js";

// For testing
export const getAllMembers = async (req, res) => {
  try {
    let query = `
      SELECT * from member;
    `;

    const result = await db.query(query);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Get all member error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Edit Member Details
export const editMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { member_username, member_name, gender, degree_program } = req.body;
    
    if (!member_name || !member_username || !gender || !degree_program) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updateQuery = `
      UPDATE member
      SET member_name = ?, member_username = ?, gender = ?, degree_program = ?
      WHERE memmber_id = ?
    `;

    await db.query(updateQuery, [member_name, member_username, gender, degree_program, memberId]);

    return res.status(201).json({
      success: true,
      message: 'Edit of member success'
    });

  } catch (error) {
    console.error('Edit member error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};