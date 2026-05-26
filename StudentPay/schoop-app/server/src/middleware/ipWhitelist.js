const allowedIPs = [
    '127.0.0.1',        // localhost
    '::1',              // IPv6 localhost
    '192.168.1.10',     // your internal server
    '34.120.10.5'       // production server IP
];

const ipWhitelist = (req, res, next) => {

    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (allowedIPs.includes(clientIP)) {
        next();
    } else {
        return res.status(403).json({
            status: 403,
            message: "Access denied: IP not allowed"
        });
    }
};

export default ipWhitelist;