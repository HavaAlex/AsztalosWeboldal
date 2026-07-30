export type Category = {
    ID?:number, 
    name:string
    postCount?:number,
    imageCount?:number,
    lastDate?:Date,
    parentID?:number,
    children?:Category[]
}

export type SortKey = 'name' | 'ID' | 'postCount' | 'postCount' | 'imageCount' | 'lastDate' | 'uploadDate'|'title'|'subtitle';
export type SortOrd = 'asc' | 'desc'
export type SortOption = {
  label: string,
  key: SortKey,
  ord: SortOrd
}

