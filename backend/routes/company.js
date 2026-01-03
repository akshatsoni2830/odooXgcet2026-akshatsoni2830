const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// GET /api/company/exists - Check if company exists
router.get('/exists', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM company');
    const exists = parseInt(result.rows[0].count) > 0;
    res.json({ exists });
  } catch (error) {
    console.error('Company exists check error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// GET /api/company - Get company info
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM company LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'Company not found',
          code: 'COMPANY_NOT_FOUND'
        }
      });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred processing your request',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// POST /api/company/setup - One-time company setup
router.post('/setup', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { company_name, company_code, company_logo, admin_name, admin_email, admin_password } = req.body;

    // Validate required fields
    if (!company_name || !company_code || !admin_name || !admin_email || !admin_password) {
      return res.status(400).json({
        error: {
          message: 'All fields are required',
          code: 'MISSING_REQUIRED_FIELDS'
        }
      });
    }

    await client.query('BEGIN');

    // Check if company already exists
    const companyCheck = await client.query('SELECT COUNT(*) as count FROM company');
    if (parseInt(companyCheck.rows[0].count) > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: {
          message: 'Company already exists',
          code: 'COMPANY_EXISTS'
        }
      });
    }

    // Create company
    const companyResult = await client.query(
      'INSERT INTO company (name, code, logo_url) VALUES ($1, $2, $3) RETURNING *',
      [company_name, company_code.toUpperCase(), company_logo || null]
    );

    // Hash password
    const bcrypt = require('bcrypt');
    const password_hash = await bcrypt.hash(admin_password, 10);

    // Create admin user
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role, password_change_required) 
       VALUES ($1, $2, 'ADMIN', false) 
       RETURNING id, email, role`,
      [admin_email, password_hash]
    );

    // Create admin profile
    const nameParts = admin_name.trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || nameParts[0];

    await client.query(
      `INSERT INTO employee_profiles (user_id, first_name, last_name)
       VALUES ($1, $2, $3)`,
      [userResult.rows[0].id, first_name, last_name]
    );

    await client.query('COMMIT');

    res.status(201).json({
      company: companyResult.rows[0],
      admin: userResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Company setup error:', error);
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

module.exports = router;
