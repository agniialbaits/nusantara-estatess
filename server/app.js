import express from 'express';
import path from 'path';
import pool from './db.js';
import { fileURLToPath } from 'url';
import { generateToken, requireAdmin, requireAuth, isAdminCredentials } from './middleware/auth.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5174;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM properties'); 
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Database error');
  } 
});

// API untuk mengambil data rumah dengan filter
app.get('/api/properties', async (req, res) => {
  try {
    const { tipe, lokasi, page = 1, limit = 10 } = req.query;
    
    let query = 'SELECT * FROM properties WHERE status = "Dijual"';
    let params = [];
    
    // Filter berdasarkan tipe rumah
    if (tipe && tipe !== 'Semua Tipe') {
      query += ' AND house_type = ?';
      params.push(tipe);
    }
    
    // Filter berdasarkan lokasi
    if (lokasi && lokasi.trim() !== '') {
      query += ' AND (location LIKE ? OR address LIKE ?)';
      params.push(`%${lokasi}%`, `%${lokasi}%`);
    }
    
    // Pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await pool.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM properties WHERE status = "Dijual"';
    let countParams = [];
    
    if (tipe && tipe !== 'Semua Tipe') {
      countQuery += ' AND house_type = ?';
      countParams.push(tipe);
    }
    
    if (lokasi && lokasi.trim() !== '') {
      countQuery += ' AND (location LIKE ? OR address LIKE ?)';
      countParams.push(`%${lokasi}%`, `%${lokasi}%`);
    }
    
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Properties API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching properties',
      error: error.message 
    });
  }
});

// API untuk mengambil detail property berdasarkan ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
    
  } catch (error) {
    console.error('Property detail API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching property detail',
      error: error.message 
    });
  }
});


// API untuk register user baru
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, dan password harus diisi' 
      });
    }

    // Cek apakah username atau email sudah ada
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?', 
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username atau email sudah terdaftar' 
      });
    }

    // Insert user baru
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );

    res.json({ 
      success: true, 
      message: 'Registrasi berhasil',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    });
  }
});

// API untuk login user dengan deteksi admin
app.post('/api/login', async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Headers:', req.headers);
    
    const { username, password } = req.body;
    
    // Validasi input
    if (!username || !password) {
      console.log('❌ Validation failed: Missing username or password');
      return res.status(400).json({ 
        success: false, 
        message: 'Username dan password harus diisi' 
      });
    }
    
    console.log('✅ Input validation passed');
    console.log('Attempting login for username:', username);

    // Kredensial admin yang sudah ditentukan
    const ADMIN_CREDENTIALS = {
      username: 'NE Administrator',
      email: 'kenzani@gmail.com',
      password: 'BARA@ssmm123'
    };

    // Cek apakah ini login admin
    const isAdminByUsername = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
    const isAdminByEmail = username === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;

    console.log('🔍 Admin check:', {
      username,
      isAdminByUsername,
      isAdminByEmail,
      expectedUsername: ADMIN_CREDENTIALS.username,
      expectedEmail: ADMIN_CREDENTIALS.email
    });

    if (isAdminByUsername || isAdminByEmail) {
      // Login sebagai admin
      console.log('✅ Admin login detected:', username);
      
      // Update last login untuk admin jika ada di database (skip jika tidak ada)
      try {
        await pool.query(
          'UPDATE users SET updated_at = NOW() WHERE username = ? OR email = ?',
          [ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.email]
        );
      } catch (updateError) {
        console.log('Admin record not found in database, continuing with hardcoded admin');
      }

      const adminUser = {
        id: 1, // ID khusus untuk admin
        username: ADMIN_CREDENTIALS.username,
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
        isAdmin: true
      };
      
      console.log('✅ Admin user object created:', adminUser);
      
      const token = generateToken(adminUser);
      
      return res.json({ 
        success: true, 
        message: 'Login admin berhasil',
        user: adminUser,
        token: token
      });
    }

    console.log('🔍 Not admin, checking database for regular user...');

    // Jika bukan admin, cari di database sebagai user biasa
    // PENTING: Jangan cari user dengan kredensial admin di database
    if (username === ADMIN_CREDENTIALS.username || username === ADMIN_CREDENTIALS.email) {
      console.log('❌ Admin credentials used but password incorrect');
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah' 
      });
    }

    const [users] = await pool.query(
      'SELECT * FROM users WHERE (username = ? OR email = ?) AND username != ? AND email != ?', 
      [username, username, ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah' 
      });
    }

    const user = users[0];

    // Validasi password untuk user biasa
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah' 
      });
    }

    // Update last login (skip if column doesn't exist)
    try {
      await pool.query(
        'UPDATE users SET updated_at = NOW() WHERE id = ?',
        [user.id]
      );
    } catch (updateError) {
      console.log('Could not update last login:', updateError.message);
    }

    // Login berhasil sebagai user biasa
    console.log('User login detected:', user.username);
    
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: 'user', // Default role untuk user biasa
      isAdmin: false
    };
    
    const token = generateToken(userResponse);
    
    res.json({ 
      success: true, 
      message: 'Login berhasil',
      user: userResponse,
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    });
  }
});

// API untuk mendapatkan data user (untuk cek session)
app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan' 
      });
    }

    res.json({ 
      success: true, 
      user: users[0] 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    });
  }
});

app.get('/api/lihat-lainnya', (req, res) => {
  res.json({
    message: 'Lihat lainnya data',
    data: [
      { id: 1, title: 'Item 1', description: 'Description for item 1' },
      { id: 2, title: 'Item 2', description: 'Description for item 2' },
      { id: 3, title: 'Item 3', description: 'Description for item 3' }
    ]
  });
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Something broke! Details: ${err.message}`);
});

// API untuk mencari rumah berdasarkan tipe dan lokasi
app.post('/api/search-rumah', async (req, res) => {
  try {
    const { tipe, lokasi } = req.body;
    
    console.log('Search request:', { tipe, lokasi });
    
    // Query untuk mencari rumah berdasarkan tipe dan lokasi
    let query = 'SELECT * FROM property WHERE 1=1';
    let params = [];
    
    if (tipe && tipe !== 'Tipe rumah') {
      query += ' AND type LIKE ?';
      params.push(`%${tipe}%`);
    }
    
    if (lokasi && lokasi.trim() !== '') {
      query += ' AND (location LIKE ? OR address LIKE ?)';
      params.push(`%${lokasi}%`, `%${lokasi}%`);
    }
    
    const [rows] = await pool.query(query, params);
    
    console.log('Search results:', rows.length, 'properties found');
    
    res.json({ 
      success: true, 
      results: rows,
      count: rows.length,
      searchParams: { tipe, lokasi }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error searching properties',
      error: error.message 
    });
  }
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ success: true, result: rows[0].result });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// ==================== ADMIN ONLY ENDPOINTS ====================

// API untuk mendapatkan semua properties (Admin only)
app.get('/api/admin/properties', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT * FROM properties ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [parseInt(limit), parseInt(offset)]
    );
    
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM properties');
    const total = countResult[0].total;
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Admin properties API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching properties for admin',
      error: error.message 
    });
  }
});

// API untuk menambah property baru (Admin only)
app.post('/api/admin/properties', requireAdmin, async (req, res) => {
  try {
    const {
      title, description, price, price_formatted, location, address,
      bedrooms, bathrooms, land_area, building_area,
      property_type, house_type, status, image_url, featured
    } = req.body;
    
    const [result] = await pool.query(`
      INSERT INTO properties (
        title, description, price, price_formatted, location, address,
        bedrooms, bathrooms, land_area, building_area,
        property_type, house_type, status, image_url, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, description, price, price_formatted, location, address,
      bedrooms, bathrooms, land_area, building_area,
      property_type, house_type, status, image_url, featured
    ]);
    
    res.json({
      success: true,
      message: 'Property berhasil ditambahkan',
      propertyId: result.insertId
    });
    
  } catch (error) {
    console.error('Add property error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding property',
      error: error.message 
    });
  }
});

// API untuk update property (Admin only)
app.put('/api/admin/properties/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Build dynamic update query
    const fields = Object.keys(updateData).filter(key => updateData[key] !== undefined);
    const values = fields.map(key => updateData[key]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data to update'
      });
    }
    
    const [result] = await pool.query(
      `UPDATE properties SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      [...values, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Property berhasil diupdate'
    });
    
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating property',
      error: error.message 
    });
  }
});

// API untuk delete property (Admin only)
app.delete('/api/admin/properties/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM properties WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Property berhasil dihapus'
    });
    
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting property',
      error: error.message 
    });
  }
});

// API untuk mendapatkan statistik (Admin only)
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [totalProperties] = await pool.query('SELECT COUNT(*) as count FROM properties');
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role != "admin"');
    const [propertiesByStatus] = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM properties 
      GROUP BY status
    `);
    const [propertiesByType] = await pool.query(`
      SELECT house_type, COUNT(*) as count 
      FROM properties 
      GROUP BY house_type
    `);
    
    res.json({
      success: true,
      stats: {
        totalProperties: totalProperties[0].count,
        totalUsers: totalUsers[0].count,
        propertiesByStatus: propertiesByStatus,
        propertiesByType: propertiesByType
      }
    });
    
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching admin statistics',
      error: error.message 
    });
  }
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('/*', (req, res) => {
  const rootPath = path.resolve(__dirname, '..'); 
  res.sendFile(path.join(rootPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:5174`);
});
