import pkg3 from 'jsonwebtoken';
const {verify} = pkg3;

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null)  {
        res.status(401);
    }

    verify(token, process.env.JWT_SECRET, (err,user) => {
        if (err) {
            res.status(403);
        }
        
        req.user = user;

        next();
    });
}

export default authenticateToken;