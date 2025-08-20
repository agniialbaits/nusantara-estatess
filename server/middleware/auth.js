import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    
    req.user = user;
    next();
  });
};

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Middleware untuk cek admin
export const requireAdmin = (req, res, next) => {
  // Cek dari session/token atau header
  const userRole = req.headers['x-user-role'];
  const username = req.headers['x-username'];
  const email = req.headers['x-email'];
  
  // Kredensial admin yang sudah ditentukan
  const ADMIN_CREDENTIALS = {
    username: 'NE Administrator',
    email: 'kenzan854@gmail.com'
  };
  
  // Cek apakah user adalah admin
  const isAdmin = userRole === 'admin' || 
                  username === ADMIN_CREDENTIALS.username || 
                  email === ADMIN_CREDENTIALS.email;
  
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini.'
    });
  }
  
  req.isAdmin = true;
  next();
};

// Middleware untuk cek user atau admin
export const requireAuth = (req, res, next) => {
  const userRole = req.headers['x-user-role'];
  const userId = req.headers['x-user-id'];
  
  if (!userRole || !userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please login first.'
    });
  }
  
  req.userRole = userRole;
  req.userId = userId;
  next();
};

// Helper function untuk cek apakah user adalah admin berdasarkan kredensial
export const isAdminCredentials = (username, email) => {
  const ADMIN_CREDENTIALS = {
    username: 'NE Administrator',
    email: 'kenzan854@gmail.com'
  };
  
  return username === ADMIN_CREDENTIALS.username || email === ADMIN_CREDENTIALS.email;
};