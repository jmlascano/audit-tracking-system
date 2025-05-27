import db from "../config/database.js";

export const getMemberFees = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { isPaid, isLate } = req.query;

    let query = `
      SELECT f.fee_id, f.fee_name, o.org_name, f.amount, f.due_date, f.payment_date, 
             f.sem_issued, f.acad_year_issued,
             CASE WHEN f.payment_date IS NULL THEN NULL ELSE 1 END AS isPaid,
             CASE 
               WHEN f.payment_date IS NULL AND CURDATE() > f.due_date THEN 1
               WHEN f.payment_date IS NOT NULL AND f.payment_date > f.due_date THEN 1
               ELSE NULL
             END AS isLate
      FROM fee f
      JOIN member m ON f.member_id = m.member_id 
      JOIN member_part_of_org mpo ON mpo.member_id = m.member_id
      JOIN org o ON mpo.org_id = o.org_id
      WHERE f.member_id = ?
    `;
    const params = [memberId];

    if (isPaid !== undefined) {
      query += ' AND (f.payment_date IS NOT NULL) = ?';
      params.push(isPaid === 'true' ? 1 : 0);
    }
    if (isLate !== undefined) {
      query += ` AND (
        CASE 
          WHEN f.payment_date IS NULL THEN 
            CASE WHEN CURDATE() > f.due_date THEN 1 ELSE 0 END
          ELSE 
            CASE WHEN f.payment_date > f.due_date THEN 1 ELSE 0 END
        END
      ) = ?`;
      params.push(isLate === 'true' ? 1 : 0);
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

    // Ratio of paid to unpaid fees
    const ratioQuery = `
      SELECT 
        SUM(CASE WHEN payment_date IS NOT NULL THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN payment_date IS NULL THEN 1 ELSE 0 END) as unpaid_count
      FROM fee
      WHERE member_id = ?
    `;
    const ratioResult = await db.query(ratioQuery, [memberId]);
    const { paid_count, unpaid_count } = ratioResult[0] || { paid_count: 0, unpaid_count: 0};
    const unpaid = Number(unpaid_count);
    const paid = Number(paid_count);
    const total = paid + unpaid;
    const paidRatio = total > 0 ? (paid / total).toFixed(2) : 0;
    const unpaidRatio = total > 0 ? (unpaid / total).toFixed(2) : 0;

    // console.log('Paid Ratio:', paidRatio, 'Unpaid Ratio:', unpaidRatio);

    return res.status(200).json({
      ratio: {
        paid: paidRatio,
        unpaid: unpaidRatio,
        paid_count,
        unpaid_count
      }
    });
  } catch (error) {
    console.error('Get member fee stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const payFee = async (req, res) => {
  try {
    const { memberId, feeId } = req.params;

    const insertQuery = `
     update fee SET payment_date = CURDATE() WHERE fee_id = ?
    `;

    await db.query(insertQuery, [feeId]);

    return res.status(201).json({
      success: true,
      message: 'Fee has been successfully paid'
    });
  } catch (error) {
    console.error('Add member fee error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Fee already exists for this member and period' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

