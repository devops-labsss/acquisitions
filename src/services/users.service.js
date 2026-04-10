import { db } from "#config/database.js";
import logger from "#config/logger.js";
import { users } from "#models/user.model.js";
import { eq } from "drizzle-orm";

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

export const getUserById = async (id) => {
    try {

        const [user] = await db.select({
            id: users.id,
            name: users.name,
            email:users.email,
            role:users.role,
            created_at:users.created_at,
            update_at: users.updated_at,
        }).from(users)
        .where(eq(users.id,id))
        .limit(1);

        if(!user) {
            throw new Error("User not found");
        }
        
        return user;
    } catch (e) {
        logger.error(`Error getting Users By Id : ${id}:`,e)
        throw e;
        
    }
}

export const updateUser = async (id, updates) => {
    try {
        
        // First check if user exist 
        const existingUser = await getUserById(id);
        
        // check if email is updated and if  already exist 
        if(updates.email && updates.email !== existingUser.email){
            const [emailExists] = await db
            .select()
            .from(users)
            .where(eq(users.email,updates.email))
            .limit(1);

            if(emailExists){ throw new Error('Email already exists')}
        }

        // Add updated at time stamp
        const updatedData = {
            ...updates,
            updated_at: new Date(),
        }

        const [updatedUser] = await db
            .update(users)
            .set(updatedData)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                role:users.role,
                created_at: users.created_at,
                updated_at: users.updated_at,
            })

            logger.info(`User ${updatedUser.email} updated sucessfully in service`)
            return updatedUser;

    } catch (e) {
        logger.error(`Error Updating user data ${e.message }`)
    }
}

export const deleteUser = async (id) => {
    try {

        const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
        })

        logger.info(`User : ${deletedUser.email} deleted sucessfully`)
        return deleteUser;
        
    } catch (e) {
        logger.error(`Error deleting User: ${id} : ${ef}`)
        throw e
    }
}