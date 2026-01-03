const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// POST /api/attendance/checkin - Record check-in timestamp for current user
router.post('/checkin', authMiddleware, async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if already checked in today
    const existingCheck = await pool.query(
      'SELECT id, check_in FROM attendance WHERE user_id = $1 AND date = $2',
      [user_id, today]
    );

    if (existingCheck.rows.length > 0) {
      return res.status(409).json({
        error: {
          message: 'Already checked in today',
          code: 'DUPLICATE_CHECKIN'
        }
      });
    }

    // Create attendance record with check-in time
    const result = await pool.query(
      `INSERT INTO attendance (user_id, date, check_in, created_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING id, user_id, date, check_in, check_out, created_at`,
      [user_id, today]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// POST /api/attendance/checkout - Record check-out timestamp for current user
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Find today's attendance record
    const existingCheck = await pool.query(
      'SELECT id, check_in, check_out FROM attendance WHERE user_id = $1 AND date = $2',
      [user_id, today]
    );

    if (existingCheck.rows.length === 0) {
      return res.status(400).json({
        error: {
          message: 'No check-in found for today',
          code: 'NO_CHECKIN'
        }
      });
    }

    if (existingCheck.rows[0].check_out) {
      return res.status(409).json({
        error: {
          message: 'Already checked out today',
          code: 'ALREADY_CHECKEDOUT'
        }
      });
    }

    // Update attendance record with check-out time
    const result = await pool.query(
      `UPDATE attendance 
       SET check_out = NOW()
       WHERE user_id = $1 AND date = $2
       RETURNING id, user_id, date, check_in, check_out, created_at`,
      [user_id, today]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// GET /api/attendance/daily?date=YYYY-MM-DD - Get daily attendance for current user
router.get('/daily', authMiddleware, async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: {
          message: 'Date parameter is required (format: YYYY-MM-DD)',
          code: 'MISSING_DATE'
        }
      });
    }

    const result = await pool.query(
      `SELECT id, user_id, date, check_in, check_out, created_at
       FROM attendance
       WHERE user_id = $1 AND date = $2`,
      [user_id, date]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get daily attendance error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// GET /api/attendance/weekly?startDate=YYYY-MM-DD - Get weekly attendance for current user
router.get('/weekly', authMiddleware, async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { startDate } = req.query;

    if (!startDate) {
      return res.status(400).json({
        error: {
          message: 'Start date parameter is required (format: YYYY-MM-DD)',
          code: 'MISSING_START_DATE'
        }
      });
    }

    // Calculate end date (6 days after start date for 7-day week)
    const result = await pool.query(
      `SELECT id, user_id, date, check_in, check_out, created_at
       FROM attendance
       WHERE user_id = $1 
         AND date >= $2 
         AND date < $2::date + INTERVAL '7 days'
       ORDER BY date ASC`,
      [user_id, startDate]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get weekly attendance error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// GET /api/attendance/user/:id - Get user attendance (admin only)
router.get('/user/:id', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    let query = `
      SELECT a.id, a.user_id, a.date, a.check_in, a.check_out, a.created_at,
             u.email, ep.first_name, ep.last_name
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN employee_profiles ep ON u.id = ep.user_id
      WHERE a.user_id = $1
    `;
    const params = [id];

    if (startDate) {
      query += ` AND a.date >= $${params.length + 1}`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND a.date <= $${params.length + 1}`;
      params.push(endDate);
    }

    query += ' ORDER BY a.date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (error) {
    console.error('Get user attendance error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

module.exports = router;
