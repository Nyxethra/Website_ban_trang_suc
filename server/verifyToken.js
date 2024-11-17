const jwt = require('jsonwebtoken');

const checkLogin = async (req, reply) => {
    const token = req.cookies.accessCookie;
    if (!token) {
        return reply.code(401).send("You are not authenticated!");
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded.id;
        req.admin=decoded.admin
    } catch (err) {
        return reply.code(401).send("Invalid Token");
    }
};

module.exports = {checkLogin};
