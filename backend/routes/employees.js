const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/employees - List all employee profiles (admin) or own profile (employee)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { role, id } = req.user;

    let query;
    let params;

    if (role === 'ADMIN') {
      // Admin sees all employees
      query = `
        SELECT 
          u.id, u.email, u.role, u.created_at,
          ep.first_name, ep.last_name, ep.phone, 
          ep.department, ep.position, ep.hire_date
        FROM users u
        LEFT JOIN employee_profiles ep ON u.id = ep.user_id
        WHERE u.role = 'EMPLOYEE'
        ORDER BY ep.first_name, ep.last_name
      `;
      params = [];
    } else {
      // Employee sees only their own profile
      query = `
        SELECT 
          u.id, u.email, u.role, u.created_at,
          ep.first_name, ep.last_name, ep.phone, 
          ep.department, ep.position, ep.hire_date
        FROM users u
        LEFT JOIN employee_profiles ep ON u.id = ep.user_id
        WHERE u.id = $1
      `;
      params = [id];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// GET /api/employees/:id - Get specific employee profile by user_id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { role, id: currentUserId } = req.user;
    const { id } = req.params;

    // Employee can only access their own profile
    if (role === 'EMPLOYEE' && currentUserId !== id) {
      return res.status(403).json({
        error: {
          message: 'You can only access your own data',
          code: 'ACCESS_DENIED'
        }
      });
    }

    const result = await pool.query(
      `SELECT 
        u.id, u.email, u.role, u.created_at,
        ep.first_name, ep.last_name, ep.phone, 
        ep.department, ep.position, ep.hire_date
      FROM users u
      LEFT JOIN employee_profiles ep ON u.id = ep.user_id
      WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// POST /api/employees - Create user with employee profile (admin only)
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { email, password, first_name, last_name, phone, department, position, hire_date } = req.body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        error: {
          message: 'Email, password, first name, and last name are required',
          code: 'MISSING_REQUIRED_FIELDS',
          details: { required: ['email', 'password', 'first_name', 'last_name'] }
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: {
          message: 'Invalid email format',
          code: 'INVALID_EMAIL'
        }
      });
    }

    await client.query('BEGIN');

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role) 
       VALUES ($1, $2, 'EMPLOYEE') 
       RETURNING id, email, role, created_at`,
      [email, password_hash]
    );

    const user = userResult.rows[0];

    // Create employee profile
    const profileResult = await client.query(
      `INSERT INTO employee_profiles (user_id, first_name, last_name, phone, department, position, hire_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user.id, first_name, last_name, phone || null, department || null, position || null, hire_date || null]
    );

    await client.query('COMMIT');

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
      ...profileResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        error: {
          message: 'Email already exists',
          code: 'DUPLICATE_EMAIL'
        }
      });
    }

    console.error('Create employee error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  } finally {
    client.release();
  }
});

// PUT /api/employees/:id - Update employee profile (admin or self with restrictions)
router.put('/:id', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { role, id: currentUserId } = req.user;
    const { id } = req.params;
    const { email, first_name, last_name, phone, department, position, hire_date } = req.body;

    // Employee can only update their own profile
    if (role === 'EMPLOYEE' && currentUserId !== id) {
      return res.status(403).json({
        error: {
          message: 'You can only access your own data',
          code: 'ACCESS_DENIED'
        }
      });
    }

    await client.query('BEGIN');

    // Check if user exists
    const userCheck = await client.query('SELECT id, role FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Update user email (admin only)
    if (email && role === 'ADMIN') {
      await client.query(
        'UPDATE users SET email = $1, updated_at = NOW() WHERE id = $2',
        [email, id]
      );
    }

    // Update employee profile
    const allowedFields = [];
    const values = [];
    let paramCount = 1;

    if (first_name !== undefined) {
      allowedFields.push(`first_name = $${paramCount++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      allowedFields.push(`last_name = $${paramCount++}`);
      values.push(last_name);
    }
    if (phone !== undefined) {
      allowedFields.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (department !== undefined) {
      allowedFields.push(`department = $${paramCount++}`);
      values.push(department);
    }
    
    // Position and hire_date can only be updated by admin
    if (role === 'ADMIN') {
      if (position !== undefined) {
        allowedFields.push(`position = $${paramCount++}`);
        values.push(position);
      }
      if (hire_date !== undefined) {
        allowedFields.push(`hire_date = $${paramCount++}`);
        values.push(hire_date);
      }
    }

    if (allowedFields.length > 0) {
      allowedFields.push(`updated_at = NOW()`);
      values.push(id);
      
      await client.query(
        `UPDATE employee_profiles SET ${allowedFields.join(', ')} WHERE user_id = $${paramCount}`,
        values
      );
    }

    await client.query('COMMIT');

    // Fetch updated profile
    const result = await pool.query(
      `SELECT 
        u.id, u.email, u.role, u.created_at,
        ep.first_name, ep.last_name, ep.phone, 
        ep.department, ep.position, ep.hire_date
      FROM users u
      LEFT JOIN employee_profiles ep ON u.id = ep.user_id
      WHERE u.id = $1`,
      [id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update employee error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  } finally {
    client.release();
  }
});

// DELETE /api/employees/:id - Delete user and profile (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    res.json({ message: 'Employee deleted successfully', id: result.rows[0].id });

  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

module.exports = router;
