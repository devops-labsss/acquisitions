import logger from "#config/logger.js";
import { jwttoken } from "#utils/jwt.js";

export const authenticatToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        // Authentication check
        if(!token) {
            return res.status(401).json({
                error: 'Authetication required',
                message: 'No access token provided',
            })
        }

        // Getting user after token verification using jwt verify() function
        const decode = jwttoken.verify(token);
        // Updating the req to contain user so it can be used further by middleware;

        req.user = decode;
        console.log(decode.role)

        
        logger.info(`User Autheticated : ${decode.email} , ${decode.role} `)
        next();
        
    } catch (e) {
        logger.error(`Authentication Error ${e}`)
        
        if(e.message === "Failed to authenticate token") {
            return res.status(401).json({
                error: "Authentication Failed",
                message: 'Inavlid or expired token'
            })
        }
        
        
        return res.status(500).json({
            error:"Internal Sevrver Error",
            message:'Error during Authentication',
        });
    }
}

//Protected route implementation to protect the controller for access using middleware;
// function calling another function eg:- of higher order function for using middleware;
// Checks wether the user role is admin or not if admin lets it pass
export const requiredRole = (allowedRoles) => {
    return (req, res,next ) => {
        // since the function depends on the above function for updating the req with user i should use trycatch
        
        try {
            

            if(!req.user) {
                return res.status(401).json({
                    error: "Authentication required",
                    message: "User not authenticated ",
                })
            }
    
            if( !allowedRoles.includes(req.user.role)) {
                logger.warn(`Acess denied for the User:${req.user.email} with the role: ${req.user.role} Required: ${allowedRoles.join(', ')} `)
    
                return res.status(401).json({
                    error: "Access denied",
                    message: "Insufficient Permission",
                })
            }
            next();
            
        } catch (e) {
            logger.error(`Role verification error ${e}`)
            return res.status(401).json({
                error: `Role verificaiton Error`,
                message: 'Error during Role Verfication.'
            })
            
        }
    }
} 