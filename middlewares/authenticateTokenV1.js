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

export default authenticateToken;