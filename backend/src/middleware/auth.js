import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No se proporcionó token de autenticación' 
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar la información del usuario al request
    req.user = {
      id: decoded.id,
      tipo: decoded.tipo,
      identificacion: decoded.identificacion
    };

    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido o expirado' 
    });
  }
};

// Middleware específico para cada tipo de usuario
export const authEstudiante = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.tipo !== 'estudiante') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso denegado. Solo estudiantes pueden acceder a esta ruta.' 
      });
    }
    next();
  });
};

export const authEmpresa = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.tipo !== 'empresa') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso denegado. Solo empresas pueden acceder a esta ruta.' 
      });
    }
    next();
  });
};

export const authAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso denegado. Solo administradores pueden acceder a esta ruta.' 
      });
    }
    next();
  });
};

export default auth;