import db from "../config/database.js";

// For testing
export const getAllMembers = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM member`);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Get all member error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const getMemberFees = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { sem_ay, isPaid, isLate } = req.query;

    let paramIndex = 1;
    let query = `
      SELECT f.fee_id, f.fee_name, o.org_name, f.amount, f.due_date, f.payment_date,
             f.sem_issued, f.acad_year_issued,
             CASE WHEN f.payment_date IS NULL THEN NULL ELSE 1 END AS isPaid,
             CASE
               WHEN f.payment_date IS NULL AND CURRENT_DATE > f.due_date THEN 1
               WHEN f.payment_date IS NOT NULL AND f.payment_date > f.due_date THEN 1
               ELSE NULL
             END AS isLate,
             CASE
              WHEN f.sem_issued = '1' THEN CONCAT(SUBSTRING(f.acad_year_issued,1,2), '-', SUBSTRING(f.acad_year_issued,3), ', ', f.sem_issued, 'st Sem')
              WHEN f.sem_issued = '2' THEN CONCAT(SUBSTRING(f.acad_year_issued,1,2), '-', SUBSTRING(f.acad_year_issued,3), ', ', f.sem_issued, 'nd Sem')
              ELSE CONCAT(SUBSTRING(f.acad_year_issued,1,2), '-', SUBSTRING(f.acad_year_issued,3), ', ', 'Midyear')
            END sem_ay
      FROM fee f
      JOIN org o ON f.org_id = o.org_id
      WHERE f.member_id = $${paramIndex++}
    `;
    const params = [memberId];

    if (isPaid !== undefined) {
      query += isPaid === 'true'
        ? ' AND f.payment_date IS NOT NULL'
        : ' AND f.payment_date IS NULL';
    }

    if (isLate !== undefined) {
      if (isLate === 'true') {
        query += ` AND (
          (f.payment_date IS NULL AND CURRENT_DATE > f.due_date)
          OR (f.payment_date IS NOT NULL AND f.payment_date > f.due_date)
        )`;
      } else {
        query += ` AND NOT (
          (f.payment_date IS NULL AND CURRENT_DATE > f.due_date)
          OR (f.payment_date IS NOT NULL AND f.payment_date > f.due_date)
        )`;
      }
    }

    if (sem_ay !== undefined) {
      if (!/^\d{2}-\d{2},\s/.test(sem_ay) || sem_ay.length < 8) {
        return res.status(400).json({ error: 'Invalid sem_ay format' });
      }
      const year = sem_ay.substring(0, 2) + sem_ay.substring(3, 5);
      const sem = sem_ay.substring(7, 8);
      query += ` AND f.acad_year_issued = $${paramIndex++} AND f.sem_issued = $${paramIndex++}`;
      params.push(year, sem);
    }

    query += ' ORDER BY f.acad_year_issued DESC, f.sem_issued DESC, f.due_date DESC';

    const result = await db.query(query, params);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Get member fees error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Fee Statistics
export const getMemberFeeStats = async (req, res) => {
  try {
    const { memberId } = req.params;

    const ratioResult = await db.query(
      `SELECT
        SUM(CASE WHEN payment_date IS NOT NULL THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN payment_date IS NULL THEN 1 ELSE 0 END) as unpaid_count
       FROM fee
       WHERE member_id = $1`,
      [memberId]
    );

    const { paid_count, unpaid_count } = ratioResult[0] || { paid_count: 0, unpaid_count: 0 };
    const unpaid = Number(unpaid_count);
    const paid = Number(paid_count);
    const total = paid + unpaid;
    const paidRatio = total > 0 ? (paid / total).toFixed(2) : 0;
    const unpaidRatio = total > 0 ? (unpaid / total).toFixed(2) : 0;

    return res.status(200).json({
      ratio: { paid: paidRatio, unpaid: unpaidRatio, paid_count, unpaid_count }
    });
  } catch (error) {
    console.error('Get member fee stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const payFee = async (req, res) => {
  try {
    const { feeId } = req.params;

    await db.query(
      `UPDATE fee SET payment_date = CURRENT_DATE WHERE fee_id = $1`,
      [feeId]
    );

    return res.status(201).json({ success: true, message: 'Fee has been successfully paid' });
  } catch (error) {
    console.error('Pay fee error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Edit Member Details
export const editMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { member_name, gender, degree_program } = req.body;

    if (!member_name || !gender || !degree_program) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.query(
      `UPDATE member SET member_name = $1, gender = $2, degree_program = $3 WHERE member_id = $4`,
      [member_name, gender, degree_program, memberId]
    );

    return res.status(201).json({ success: true, message: 'Edit of member success' });

  } catch (error) {
    console.error('Edit member error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
