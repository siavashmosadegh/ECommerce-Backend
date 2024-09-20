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
        console.log(req);
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

export {
    authenticateToken,
    authorizeRoles,
    extractIdFromToken
}