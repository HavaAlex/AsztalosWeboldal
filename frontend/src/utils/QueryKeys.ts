const USER_KEYS = {
    users: 'users',
    user: 'user'
}

const AUTH_KEYS = {
    setPassword: 'setPassword',
    passwordReset:'passwordReset',
    ChangePassword:'ChangePassword',
    Login:'Login',
    ChangeUsername:'ChangeUsername'
}

const SITE_KEYS = {
    getCategories: 'getCategories',
    getPostsByCategory: 'getPostsByCategory',
    getPostsByNewest:'getPostsByNewest'
}

const ADMIN_KEYS = {
    getCategoriesAdmin: 'getCategoriesAdmin',
    addCategoryAdmin: 'addCategoryAdmin',
    modifyCategory: 'modifyCategory',
    getPosts:'getPosts',
    uploadPostFiles: 'uploadPostFiles',
    deletePost:'deletePost',
    deleteImage:'deleteImage'
}

export const QUERY_KEYS = {
    ...USER_KEYS,
    ...AUTH_KEYS,
    ...SITE_KEYS,
    ...ADMIN_KEYS
} as const 