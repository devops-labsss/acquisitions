import { getAllUsers } from "#services/users.service.js";

export const fetchAllUsers = async (req, res, next) => {
    try {

        const allUsers = await getAllUsers();

        res.status(200).json({ message: "Successfully retrived Users.",Users: allUsers})
        
    } catch (e) {
        logger.error(`Error while fetching users`);
        next();
    }
}