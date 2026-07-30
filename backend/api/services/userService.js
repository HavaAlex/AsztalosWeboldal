const user = require("../models/user");
const userRepository  = require("../repositories/userRepository"); 

class UserService
{
    async createUser(user)
    {
        return await userRepository.createUser(user);
    }

    async getUsers()
    { 
        return await userRepository.getUsers();
    }

    async getUserByUsername(username)
    {
        return await userRepository.getUserByUsername(username);
    }
    async getUserByID(ID)
    {
        return await userRepository.getUser(ID);
    }
}

module.exports = new UserService();