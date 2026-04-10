import logger from "#config/logger.js";
import { deleteUser, getAllUsers, getUserById, updateUser } from "#services/users.service.js";
import { formatValidationErrors } from "#utils/format.js";
import { userIdSchema, userUpdateSchema } from "#validations/users.validation.js";

export const fetchAllUsers = async (req, res, next) => {
    try {

        const allUsers = await getAllUsers();

        res.status(200).json({ message: "Successfully retrived Users.",Users: allUsers})
        
    } catch (e) {
        logger.error(`Error while fetching users`);
        next();
    }
}

export const fetchUserById = async ( req, res) => {
    try {
        // my zod expects an id so stored in the key named id and sent it to parse;
        const validtionResult = userIdSchema.safeParse({id:req.params.id})

        if(!validtionResult.success) {
            return res.status(400).json({
                error: 'Request Validation failed',
                message: formatValidationErrors(validtionResult.error)                           
            })
        }

        const {id} = validtionResult.data;
        const user = await getUserById(id);

        logger.info(`User : ${user.email} retrived successfully`);
        
        res.status(200).json({
            message: "User retrived successfully",
            user:user,
        })
                    
    } catch (e) {
        logger.error(`Error Getting User by ID: ${e}`)
        
        if(e.message === "User not found"){
            return res.json({message:'User not found'})

        }
    }
}



export const updateUserById = async (req , res) => {
    try {
            logger.info(`Updating User: ${req.params.id}`)
            // Validate the user id parameter
        const isValidationResult = userIdSchema.safeParse({id:req.params.id})

        if(!isValidationResult.success) {
            return res.status(400).json({
                error : "Validation Failed",
                details : formatValidationErrors(isValidationResult.error)
            })
        }

        
        // Validating the Update data 
        logger.info(`Body data : ${req.body}`)
        console.log(req.body)
        const updateValidationResult = userUpdateSchema.safeParse(req.body)
        
        if(!updateValidationResult.success) {
            return res.status(400).json({
                error : "Validation Failed in updateSchema",
                details : formatValidationErrors(updateValidationResult.error)
            })
        }

        const { id } = isValidationResult.data;
        const updates = updateValidationResult.data;
        logger.info(updates)

        // Autheriazation check
        if(!req.user) {
            return res.status(400)
            .json({ error: 'Auhtorisation Failed', message: "You must be logged in to update user information "})
        }

        // Allow user to update only their own information except role 
        if(req.user.role !== 'admin' && req.user.id !== id ) {
            return res.status(400)
            .json({ error: "Access denied ", message: 'You can Update your information' })
        }

        console.log(`|${req.user.role}|`); 
// If it prints |admin |, the space is causing the mismatch.
        // Only admin user can change their role
        if(updates.role && req.user.role !== 'admin') {
            return res.status(400)
            .json({ error: 'Access denied', message: 'Only admin user can change user role'})
        }

        if(req.user.role !== 'admin') {
            delete updates.role;
        }

        const updatedUser = await updateUser(id, updates)

        logger.info(`User : ${updatedUser.email} updated sucessfully `);

        res.status(200)
        .json({ message: `User updated Successfully`, User: updatedUser.email})
        
    } catch (e) {
        logger.error(`Error updating user in controller: ${req.user} `)

        if(e.message == 'User not found') {
            return res.status(403).json({ error: "User not found"})
        }

        if(e.message == 'Email alredy Exist') {
            return res.status(403).json({ error: "Email alredy Exist"})
        }       
        
        return res.status(500).json({error: `Error Updating the User ${e}`})
    }
}

// Only admins can delete the accounts and admins can not self delete their account
export const deleteUserById = async (req, res, next) => {
    try {

        logger.info(`Deleting user : ${req.params.id}`)

        //Validate the user ID parameter
        const isValidationResult = userIdSchema.safeParse({id: req.params.id})

        if(!isValidationResult.success) {
            return res.status(400).json({
                error: `Validation Failed`,
                details: formatValidationErrors(isValidationResult.error),
            })
        }

        const {id} = isValidationResult.data;

         // Authorization checks
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to delete users',
      });
    }

    // Only admin users can delete users (prevent self-deletion or user deletion by non-admins)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only administrators can delete users',
      });
    }

    // Prevent admins from deleting themselves
    if (req.user.id === id) {
      return res.status(403).json({
        error: 'Operation denied',
        message: 'You cannot delete your own account',
      });
    }
        
        const deletedUser = await deleteUser(id)

        logger.info(`User : ${deletedUser.email} delted sucessfully`)

        res.json({ message: "User Deleted sucessfully ",user: deletedUser,})
            
    } catch (e) {
        logger.error(`Error deleting User ${e.message}`)

        if(e.message === 'User not found') {
            
            return res.status(403).json({
                error: "User not found",
            })
        }

        next();
    }
}