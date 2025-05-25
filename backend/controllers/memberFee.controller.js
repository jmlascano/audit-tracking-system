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