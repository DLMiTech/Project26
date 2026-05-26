const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.status(401).json({
            status: 401,
            message: 'Role not authorized',
        });
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.status(401).json({
            status: 401,
            message: 'Role not authorized',
        });
        next();
    }
}

export default verifyRoles