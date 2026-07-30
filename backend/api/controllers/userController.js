const userService = require("../services/userService");

const userRepository  = require("../repositories/userRepository"); 

const bcrypt = require("bcrypt");

const salt = 10;

const jwt = require("jsonwebtoken");

exports.getUser = async (req, res, next) => 
{
    res.status(200).send(await userService.getUser(req.userID));
}

exports.createUser = async (req, res, next) =>
{
    const { ID, name, password } = req.body;

    const newUser =
    {
        ID: ID,
        name: name,
        password: await bcrypt.hash(password, salt),
    }

    const result = await userService.createUser(newUser);

    if(result)
    {
        res.status(201).json(result);
    }
    else
    {
        res.status(400).send("Fail");
    }
}

exports.loginUser = async (req, res, next) =>
{
    const { username, password } = req.body;
    console.log(username," ",password)
    if(username == undefined || password == undefined)
    {
        res.status(400).send("Nincs megadva az egyik paraméter!");
        return
    }
    
    const user = await userService.getUserByUsername(username);
    if(user == undefined)
    {
        res.status(404).send("Nincs ilyen felhasználó!");
        return
    }

    let userData = null;
    
    if(await bcrypt.compare(password, user.password))
    {
        const tokenPayload = { username: user.username };
        console.log(">>Password is correct - Assinging cookie.")
        const token = jwt.sign(tokenPayload, process.env.JWT_KEY, { expiresIn: "20m" });

        res.status(200).json(token);
    }
    else
    {
        console.log(">>Incorrect Password")
        res.status(401).send("Helytelen jelszó!");
    }
}
exports.changePassword = async (req,res,next)=>{
    const passwordData = req.body.data;
    if(passwordData.userName == '' || passwordData.currentPassword == '' || passwordData.currentPasswordAgain== '' || passwordData.newPassword==''){
        res.status(500).send("Valamelyik mező üres!")
        return
    }
    if(passwordData.currentPassword != passwordData.currentPasswordAgain){
        res.status(500).send("A két jelszó nem egyezik!")
        return
    }
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY); // no callback
    if(decoded.username != passwordData.userName){
        
        res.status(500).send("A megadott felhasználónév nem azé a fióké amit ön most használ! ")
    }
    const user = await userRepository.getUserByUsername(passwordData.userName)
    if(!user){
        res.status(500).send("Ezzel a felhasználónévvel nincs felhasználó")
        return
    }

    if(!await bcrypt.compare(passwordData.currentPassword, user.password)){
        res.status(500).send("Az ön által megadott jelszó nem egyezik ennek a felhasználónak a jelszavával")
        return
    }
    else if(await bcrypt.compare(passwordData.currentPassword, user.password)){
        const userReplacement = {
            ID: user.ID,
            username: user.username,
            password: await bcrypt.hash(passwordData.newPassword, salt),
        }
        const response = await userRepository.changePassword(userReplacement.ID, userReplacement)
        res.status(201).json(response)
    }
}

exports.changeUserName = async (req,res,next) =>{
    const userNameData = req.body.data;
    if(userNameData.currentUserName ==''||userNameData.newUserName ==''|| userNameData.password ==''){
        res.status(500).send("Valamelyik mező üres!")
    }

    if(userNameData.currentUserName==userNameData.newUserName){
        res.status(500).send("A két felhasználónév megegyezik!")
    }
    
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY); // no callback
    if(decoded.username != userNameData.currentUserName){
        
        res.status(500).send("A megadott felhasználónév nem azé a fióké amit ön most használ! ")
    }
    const user = await userRepository.getUserByUsername(userNameData.currentUserName)
    if(!user){
        res.status(500).send("Ezzel a felhasználónévvel nincs felhasználó")
        return
    }

    if(!await bcrypt.compare(userNameData.password, user.password)){
        res.status(500).send("Az ön által megadott jelszó nem egyezik ennek a felhasználónak a jelszavával")
        return
    }
    

    

    if(await bcrypt.compare(userNameData.password, user.password)){
        const response = await userRepository.changeUserName(user.ID, userNameData.newUserName)
        res.status(201).json(response)
    }
}


