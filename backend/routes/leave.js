const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// POST /api/leave/request - Submit leave request with PENDING status for current user
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { leave_type, start_date, end_date, reason } = req.body;

    // Validate required fields
    if (!leave_type || !start_date || !end_date) {
      return res.status(400).json({
        error: {
          message: 'Leave type, start date and end date are required',
          code: 'MISSING_REQUIRED_FIELDS',
          details: { required: ['leave_type', 'start_date', 'end_date'] }
        }
      });
    }

    // Validate leave type
    if (!['PAID', 'SICK', 'UNPAID'].includes(leave_type)) {
      return res.status(400).json({
        error: {
          message: 'Leave type must be PAID, SICK, or UNPAID',
          code: 'INVALID_LEAVE_TYPE'
        }
      });
    }

    // Validate date range (end date must be after or equal to start date)
    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({
        error: {
          message: 'End date must be after start date',
          code: 'INVALID_DATE_RANGE'
        }
      });
    }

    // Create leave request with PENDING status
    const result = await pool.query(
      `INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, reason, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'PENDING', NOW(), NOW())
       RETURNING id, user_id, leave_type, start_date, end_date, reason, status, created_at, updated_at`,
      [user_id, leave_type, start_date, end_date, reason || null]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Create leave request error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// GET /api/leave/my-requests - Get own leave requests using user_id from token
router.get('/my-requests', authMiddleware, async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const result = await pool.query(
      `SELECT id, user_id, leave_type, start_date, end_date, reason, status, admin_comments, created_at, updated_at
       FROM leave_requests
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [user_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get my leave requests error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// GET /api/leave/pending - Get pending requests (admin only)
router.get('/pending', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        lr.id, lr.user_id, lr.leave_type, lr.start_date, lr.end_date, lr.reason, lr.status, 
        lr.admin_comments, lr.created_at, lr.updated_at,
        u.email, ep.first_name, ep.last_name
       FROM leave_requests lr
       JOIN users u ON lr.user_id = u.id
       LEFT JOIN employee_profiles ep ON u.id = ep.user_id
       WHERE lr.status = 'PENDING'
       ORDER BY lr.created_at ASC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get pending leave requests error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// GET /api/leave/all - Get all leave requests (admin only)
router.get('/all', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        lr.id, lr.user_id, lr.leave_type, lr.start_date, lr.end_date, lr.reason, lr.status, 
        lr.admin_comments, lr.created_at, lr.updated_at,
        u.email, ep.first_name, ep.last_name
       FROM leave_requests lr
       JOIN users u ON lr.user_id = u.id
       LEFT JOIN employee_profiles ep ON u.id = ep.user_id
       ORDER BY lr.created_at DESC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get all leave requests error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// PUT /api/leave/:id/approve - Approve leave (admin only)
router.put('/:id/approve', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_comments } = req.body;

    // Check if leave request exists and is pending
    const checkResult = await pool.query(
      'SELECT id, status FROM leave_requests WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'Leave request not found',
          code: 'LEAVE_NOT_FOUND'
        }
      });
    }

    if (checkResult.rows[0].status !== 'PENDING') {
      return res.status(400).json({
        error: {
          message: `Leave request is already ${checkResult.rows[0].status.toLowerCase()}`,
          code: 'INVALID_STATUS'
        }
      });
    }

    // Update status to APPROVED with optional admin comments
    const result = await pool.query(
      `UPDATE leave_requests 
       SET status = 'APPROVED', admin_comments = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, user_id, leave_type, start_date, end_date, reason, status, admin_comments, created_at, updated_at`,
      [id, admin_comments || null]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// PUT /api/leave/:id/reject - Reject leave (admin only)
router.put('/:id/reject', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_comments } = req.body;

    // Check if leave request exists and is pending
    const checkResult = await pool.query(
      'SELECT id, status FROM leave_requests WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'Leave request not found',
          code: 'LEAVE_NOT_FOUND'
        }
      });
    }

    if (checkResult.rows[0].status !== 'PENDING') {
      return res.status(400).json({
        error: {
          message: `Leave request is already ${checkResult.rows[0].status.toLowerCase()}`,
          code: 'INVALID_STATUS'
        }
      });
    }

    // Update status to REJECTED with optional admin comments
    const result = await pool.query(
      `UPDATE leave_requests 
       SET status = 'REJECTED', admin_comments = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, user_id, leave_type, start_date, end_date, reason, status, admin_comments, created_at, updated_at`,
      [id, admin_comments || null]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Reject leave error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

module.exports = router;
