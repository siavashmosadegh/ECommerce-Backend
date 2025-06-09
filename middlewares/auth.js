import pkg3 from 'jsonwebtoken';
const {verify} = pkg3;

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // if (typeof req.headers['authorization'] === 'undefined')  {
    //     console.log("hey")
    //     res.status(401);
    // }

    verify(token, process.env.JWT_SECRET, (err,user) => {
        if (err) {
            console.log(err);
            res.status(403).json({
                error: err
            });
        }
        
        req.user = user;

        next();
    });
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    }
}

const extractIdFromToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return err.message
        }

        console.log(decoded);

        req.userId = decoded.id;

        next();
    })
}

function isValidPhoneNumber(phone) {
    return /^(\+98|0)9\d{9}$/.test(phone);
}

const validatePhoneNumber = (req, res, next) => {
    const phone = req.body.mobile;

    if (!phone || !isValidPhoneNumber(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    next(); // phone number is valid
};

export {
    authenticateToken,
    authorizeRoles,
    extractIdFromToken,
    validatePhoneNumber
}