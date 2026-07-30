export type Post = {
    ID?:int,
    title:string,
    subtitle:string,
    desc:string,
    categoryID:int,
    files:File[],
    showOnHomePage?:boolean
    uploadDate?:Date;
    images?:[{
        ID:number,
        postID:number,
        filename:string
    }]
}
export type UploadPost = {
    ID?:int,
    title:string,
    subtitle:string,
    desc:string,
    categoryID:int,
    uploadDate:Date,
    files:FormData;
}

export type DeletedImage = {
    postID:number,
    imagename:string|undefined
}