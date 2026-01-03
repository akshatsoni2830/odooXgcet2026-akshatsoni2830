const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/payroll/my-payroll - Get own payroll records using user_id from token
router.get('/my-payroll', authMiddleware, async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const result = await pool.query(
      `SELECT id, user_id, month, year, base_salary, deductions, net_salary, created_at, updated_at
       FROM payroll
       WHERE user_id = $1
       ORDER BY year DESC, month DESC`,
      [user_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get my payroll error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// GET /api/payroll - Get all payroll records (admin only)
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.id, p.user_id, p.month, p.year, p.base_salary, p.deductions, p.net_salary,
        p.created_at, p.updated_at,
        u.email, ep.first_name, ep.last_name
       FROM payroll p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN employee_profiles ep ON u.id = ep.user_id
       ORDER BY p.year DESC, p.month DESC, ep.first_name, ep.last_name`
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get all payroll error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// GET /api/payroll/user/:id - Get payroll for specific user (admin only)
router.get('/user/:id', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        p.id, p.user_id, p.month, p.year, p.base_salary, p.deductions, p.net_salary,
        p.created_at, p.updated_at,
        u.email, ep.first_name, ep.last_name
       FROM payroll p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN employee_profiles ep ON u.id = ep.user_id
       WHERE p.user_id = $1
       ORDER BY p.year DESC, p.month DESC`,
      [id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get user payroll error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// POST /api/payroll - Create payroll entry with user_id (admin only)
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { user_id, month, year, base_salary, deductions, net_salary } = req.body;

    // Validate required fields
    if (!user_id || !month || !year || base_salary === undefined || net_salary === undefined) {
      return res.status(400).json({
        error: {
          message: 'User ID, month, year, base salary, and net salary are required',
          code: 'MISSING_REQUIRED_FIELDS',
          details: { required: ['user_id', 'month', 'year', 'base_salary', 'net_salary'] }
        }
      });
    }

    // Validate month range
    if (month < 1 || month > 12) {
      return res.status(400).json({
        error: {
          message: 'Month must be between 1 and 12',
          code: 'INVALID_MONTH'
        }
      });
    }

    // Validate numeric values
    if (base_salary < 0 || net_salary < 0 || (deductions && deductions < 0)) {
      return res.status(400).json({
        error: {
          message: 'Salary and deductions must be positive values',
          code: 'INVALID_NUMERIC_VALUE'
        }
      });
    }

    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Create payroll entry
    const result = await pool.query(
      `INSERT INTO payroll (user_id, month, year, base_salary, deductions, net_salary, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, user_id, month, year, base_salary, deductions, net_salary, created_at, updated_at`,
      [user_id, month, year, base_salary, deductions || 0, net_salary]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        error: {
          message: 'Payroll entry already exists for this user, month, and year',
          code: 'DUPLICATE_PAYROLL'
        }
      });
    }

    console.error('Create payroll error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// PUT /api/payroll/:id - Update payroll entry (admin only)
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year, base_salary, deductions, net_salary } = req.body;

    // Check if payroll entry exists
    const checkResult = await pool.query('SELECT id FROM payroll WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'Payroll entry not found',
          code: 'PAYROLL_NOT_FOUND'
        }
      });
    }

    // Validate month if provided
    if (month !== undefined && (month < 1 || month > 12)) {
      return res.status(400).json({
        error: {
          message: 'Month must be between 1 and 12',
          code: 'INVALID_MONTH'
        }
      });
    }

    // Validate numeric values if provided
    if ((base_salary !== undefined && base_salary < 0) || 
        (net_salary !== undefined && net_salary < 0) || 
        (deductions !== undefined && deductions < 0)) {
      return res.status(400).json({
        error: {
          message: 'Salary and deductions must be positive values',
          code: 'INVALID_NUMERIC_VALUE'
        }
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (month !== undefined) {
      updates.push(`month = $${paramCount++}`);
      values.push(month);
    }
    if (year !== undefined) {
      updates.push(`year = $${paramCount++}`);
      values.push(year);
    }
    if (base_salary !== undefined) {
      updates.push(`base_salary = $${paramCount++}`);
      values.push(base_salary);
    }
    if (deductions !== undefined) {
      updates.push(`deductions = $${paramCount++}`);
      values.push(deductions);
    }
    if (net_salary !== undefined) {
      updates.push(`net_salary = $${paramCount++}`);
      values.push(net_salary);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: {
          message: 'No fields to update',
          code: 'NO_UPDATES'
        }
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE payroll SET ${updates.join(', ')} WHERE id = $${paramCount}
       RETURNING id, user_id, month, year, base_salary, deductions, net_salary, created_at, updated_at`,
      values
    );

    res.json(result.rows[0]);

  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        error: {
          message: 'Payroll entry already exists for this user, month, and year',
          code: 'DUPLICATE_PAYROLL'
        }
      });
    }

    console.error('Update payroll error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// DELETE /api/payroll/:id - Delete payroll entry (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM payroll WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'Payroll entry not found',
          code: 'PAYROLL_NOT_FOUND'
        }
      });
    }

    res.json({ message: 'Payroll entry deleted successfully', id: result.rows[0].id });

  } catch (error) {
    console.error('Delete payroll error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

module.exports = router;
