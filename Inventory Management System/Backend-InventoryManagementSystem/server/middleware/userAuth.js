import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ Success: false, message: "Unauthorized. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.status(401).json({ Success: false, message: "Invalid token payload." });
        }

        req.user = { id: decoded.id }; // Attach user info to req.user
        next();

    } catch (error) {
        return res.status(401).json({ Success: false, message: "Invalid or expired token." });
    }
};

export default userAuth;
