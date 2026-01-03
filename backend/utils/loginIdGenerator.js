const pool = require('../config/database');

/**
 * Generate login_id in format: [CompanyCode][FirstInitial][LastInitial][Year][Serial]
 * Example: OIJO20230001
 */
async function generateLoginId(firstName, lastName) {
  try {
    // Get company code
    const companyResult = await pool.query('SELECT code FROM company LIMIT 1');
    if (companyResult.rows.length === 0) {
      throw new Error('Company not found');
    }
    const companyCode = companyResult.rows[0].code;

    // Get initials
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    // Get current year
    const year = new Date().getFullYear();

    // Get next serial number for this year
    const pattern = `${companyCode}${firstInitial}${lastInitial}${year}%`;
    const serialResult = await pool.query(
      `SELECT login_id FROM users 
       WHERE login_id LIKE $1 
       ORDER BY login_id DESC 
       LIMIT 1`,
      [pattern]
    );

    let serial = 1;
    if (serialResult.rows.length > 0) {
      const lastLoginId = serialResult.rows[0].login_id;
      const lastSerial = parseInt(lastLoginId.slice(-4));
      serial = lastSerial + 1;
    }

    // Format serial with leading zeros
    const serialStr = serial.toString().padStart(4, '0');

    return `${companyCode}${firstInitial}${lastInitial}${year}${serialStr}`;

  } catch (error) {
    console.error('Generate login_id error:', error);
    throw error;
  }
}

/**
 * Generate random password
 */
function generatePassword() {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

module.exports = {
  generateLoginId,
  generatePassword
};
