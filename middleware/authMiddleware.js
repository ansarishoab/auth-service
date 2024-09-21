const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) { return res.status(401).json({ msg: "Authorization denied" }) }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        console.log(decoded);
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });

    }
};