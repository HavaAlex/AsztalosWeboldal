const db = require("../db/dbContext");
const user = require("../models/user");

class UserRepository
{
    constructor(db)
    {
        this.Users = db.user;
    }

    async createUser(user)
    {
        const newUser = await this.Users.build(user);

        await newUser.save();
        
        return newUser;
    }

    async getUsers()
    {
        return await this.Users.findAll();
    }

    async getUserByUsername(username)
    {
        return await this.Users.findOne
        (
            {
                where:
                {
                    username: username,
                }
            }
        )
    }

    async getUserByID(ID)
    {
        return await this.Users.findOne
        (
            {
                where:
                {
                    ID: ID,
                }
            }
        )
    }

    async deleteUser(ID){
        await this.Users.destroy({
            where:{
                ID: ID
            }
        })
        
        return "User with ID:" + ID + " deleted."
    }


    async generatePassword() { //véletlenszerű jelszó generálás
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()_+";
        let password = "";
        for (let i = 0; i < 12; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
        return password;
    }

    async getAllUsers() {
        return await this.Users.findAll({
            attributes: ['ID', 'username']
        });
    }
    async changePassword(ID, userReplacement){
        const record = await this.Users.findOne({
            where: { ID }
        });
        await record.update(userReplacement);
        return record;
    }
    async changeUserName(ID,newName){
        console.log(ID, " ", newName)
        const User = await this.Users.findOne({
            where: { ID }
        })
        return await User.update({username:newName})
    }
}

module.exports = new UserRepository(db);