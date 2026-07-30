export type Category = {
    ID?:number, 
    name:string
    postCount?:number,
    imageCount?:number,
    lastDate?:Date,
    parentID?:number,
    children?:Category[]
}