import { db } from "#config/database.js";
import { users } from "#models/user.model.js";

export const getAllUsers = async () => {
    try {
        
        const allUser = await db.select({
            id: users.id,
            name: users.name,
            email:users.email,
            created_at:users.created_at,
            updated_at:users.updated_at,
        }).from(users)

        return (allUser)
        
    } catch (e) {
        logger.error('Error Getting All Users');
        throw e 
    }
}