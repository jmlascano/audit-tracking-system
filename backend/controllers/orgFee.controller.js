import db from "../config/database.js";

// Get Fees by Organization
export const getOrgFees = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { sem_ay, isPaid, isLate } = req.query;

    // MySQL session time zone to PST
    await db.query('SET time_zone = "-08:00"');

    let query = `
      SELECT f.fee_id, f.fee_name, m.member_name, f.amount, f.due_date, f.payment_date, 
             f.sem_issued, f.acad_year_issued,
             CASE WHEN f.payment_date IS NULL THEN 0 ELSE 1 END AS isPaid,
             CASE 
               WHEN f.payment_date IS NULL AND CURDATE() > f.due_date THEN 'Late'
               WHEN f.payment_date IS NULL AND CURDATE() <= f.due_date THEN 'On Time'
               WHEN f.payment_date > f.due_date THEN 'Late'
               ELSE 'On Time'
             END AS isLate,
            CASE 
              WHEN f.sem_issued = '1' THEN CONCAT(SUBSTRING(f.acad_year_issued,1,2), '-', SUBSTRING(f.acad_year_issued,3), ', ', f.sem_issued, 'st Sem') 
              WHEN f.sem_issued = '2' THEN CONCAT(SUBSTRING(f.acad_year_issued,1,2), '-', SUBSTRING(f.acad_year_issued,3), ', ', f.sem_issued, 'nd Sem') 
              ELSE CONCAT(SUBSTRING(f.acad_year_issued,1,2), '-', SUBSTRING(f.acad_year_issued,3), ', ', 'Midyear') 
            END sem_ay
      FROM fee f
      JOIN member m ON f.member_id = m.member_id
      WHERE f.org_id = ?
    `;
    const params = [orgId];

    if (isPaid !== undefined) {
      query += ' AND (f.payment_date IS NOT NULL) = ?';
      params.push(isPaid === 'true' ? 1 : 0);
    }
    if (isLate !== undefined) {
      query += ` AND (
        CASE 
          WHEN f.payment_date IS NULL AND CURDATE() > f.due_date THEN 'Late'
          WHEN f.payment_date IS NULL AND CURDATE() <= f.due_date THEN 'On Time'
          WHEN f.payment_date > f.due_date THEN 'Late'
          ELSE 'On Time'
        END
      ) = ?`;
      params.push(isLate);
    }

    if (sem_ay !== undefined) {
      // Expected format: "YY-YY, <sem>" e.g. "24-25, 1st Sem"
      if (!/^\d{2}-\d{2},\s/.test(sem_ay) || sem_ay.length < 8) {
        return res.status(400).json({ error: 'Invalid sem_ay format' });
      }
      const year = sem_ay.substring(0, 2) + sem_ay.substring(3, 5);
      const sem = sem_ay.substring(7, 8);
      query += ' AND f.acad_year_issued LIKE ? AND f.sem_issued LIKE ?';
      params.push(year, sem);
    }

    query += ' ORDER BY f.acad_year_issued DESC, f.sem_issued DESC, f.due_date DESC';

    const result = await db.query(query, params);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Get org fees error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Add Fee to Organization
export const addOrgFee = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { fee_name, member_username, amount, due_date, sem_issued, acad_year_issued } = req.body;

    if (!fee_name || !member_username || !amount || !due_date || !sem_issued || !acad_year_issued) {
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
      INSERT INTO fee (fee_name, amount, due_date, sem_issued, acad_year_issued, member_id, org_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(insertQuery, [fee_name, amount, due_date, sem_issued, acad_year_issued, member_id, orgId]);

    return res.status(201).json({
      success: true,
      message: 'Fee added successfully'
    });
  } catch (error) {
    console.error('Add org fee error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Fee already exists for this member and period' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Fee Due Date
export const updateOrgFeeDue = async (req, res) => {
  try {
    const { orgId, feeId } = req.params;
    const { due_date } = req.body;

    if (!due_date) {
      return res.status(400).json({ error: 'Due date is required' });
    }

    // Validate due_date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
      return res.status(400).json({ error: 'Invalid due date format. Use YYYY-MM-DD' });
    }

    const updateQuery = `
      UPDATE fee 
      SET due_date = ?
      WHERE fee_id = ? AND org_id = ?
    `;

    const result = await db.query(updateQuery, [due_date, feeId, orgId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Fee due date updated successfully'
    });
  } catch (error) {
    console.error('Fee due date error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Fee
export const deleteOrgFee = async (req, res) => {
  try {
    const { orgId, feeId } = req.params;

    const deleteQuery = `
      DELETE FROM fee 
      WHERE fee_id = ? AND org_id = ?
    `;

    const result = await db.query(deleteQuery, [feeId, orgId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Fee deleted successfully'
    });
  } catch (error) {
    console.error('Delete org fee error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Fee Statistics
export const getOrgFeeStats = async (req, res) => {
  try {
    const { orgId } = req.params;

    // Member with highest debt
    const highestDebtQuery = `
      SELECT m.member_name, SUM(f.amount) as total_debt
      FROM fee f
      JOIN member m ON f.member_id = m.member_id
      WHERE f.org_id = ? AND f.payment_date IS NULL
      GROUP BY f.member_id, m.member_name
      ORDER BY total_debt DESC
      LIMIT 1
    `;
    const highestDebtResult = await db.query(highestDebtQuery, [orgId]);
    const highestDebt = highestDebtResult[0] || { member_name: 'None', total_debt: 0 };

    // Ratio of paid to unpaid fees
    const ratioQuery = `
      SELECT 
        SUM(CASE WHEN payment_date IS NOT NULL THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN payment_date IS NULL THEN 1 ELSE 0 END) as unpaid_count
      FROM fee
      WHERE org_id = ?
    `;
    const ratioResult = await db.query(ratioQuery, [orgId]);
    const { paid_count, unpaid_count } = ratioResult[0] || { paid_count: 0, unpaid_count: 0 };
    const total = paid_count + unpaid_count;
    const paidRatio = total ? (paid_count / total) : 0;
    const unpaidRatio = total ? (unpaid_count / total) : 0;

    return res.status(200).json({
      highestDebt: {
        member_name: highestDebt.member_name,
        total_debt: highestDebt.total_debt
      },
      ratio: {
        paid: paidRatio,
        unpaid: unpaidRatio,
        paid_count,
        unpaid_count
      }
    });
  } catch (error) {
    console.error('Get org fee stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};