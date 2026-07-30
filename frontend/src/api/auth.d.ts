export type LoginData = {
    username:string, 
    password:string
}

export type ChangePasswordData = {
    userName:string,
    currentPassword:string,
    currentPasswordAgain:string,
    newPassword:string
}


export type ChangeUserNameData = {
    currentUserName: string, 
    newUserName:string,
    password:string
}