const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).send("Access denied");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY); // no callback
        next();
    } catch (err) {
        console.log(err);
        return res.status(400).send("Invalid token");
    }
};
