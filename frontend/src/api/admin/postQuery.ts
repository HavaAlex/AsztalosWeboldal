import axiosClient from "@/lib/axios"
import type { DeletedImage, Post,UploadPost } from "./post"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler"
import { useErrorHandler } from "@/stores/errorHandler"
import queryClient from "@/lib/queryClient";


const getPosts = async (data: Number[]) : Promise<Post[]> =>{ //a data a már lefetchelt postok id-ja
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}`,IDs:data.map(String)}
    }; 
    const response = await axiosClient.get(`/admin/posts`,config) // ${document.cookie}

    return response.data
}
export const useGetPosts = () => {
    const { setError } = useErrorHandler()

    const query = useMutation({
        mutationKey: [QUERY_KEYS.getPosts],
        mutationFn: getPosts
    })

    if (query.error.value) {
        setError(query.error.value)
    }
    return query
}



const addPost = async (data: Post) : Promise<UploadPost> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}`,
                  "Content-Type": "multipart/form-data" }
    }; 
    console.log("Anyád: ", data)
    const formData = new FormData();
    
    formData.append("title", data.title);
    formData.append("subtitle", data.subtitle);
    formData.append("desc", data.desc);
    formData.append("categoryID", data.categoryID);
    
    if(data.showOnHomePage !== null && data.showOnHomePage!== undefined){
        formData.append("showOnHomePage",data.showOnHomePage.toString());
    }
    
    data.files.forEach((file) => {formData.append('files', file);});
    
    const response = await axiosClient.post(`/admin/posts`,formData,config) // ${document.cookie}
    return response.data
}
export const useAddPost = () => {
    return useMutation( 
        {
            mutationFn: addPost,
            onSuccess(data){
                
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getPosts],
                                            exact: false})
                
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}


const modifyPost = async (data: Post) : Promise<UploadPost> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}`,
                  "Content-Type": "multipart/form-data" }
    }; 
    const formData = new FormData();
    formData.append("ID",data.ID);
    formData.append("title", data.title);
    formData.append("subtitle", data.subtitle);
    formData.append("desc", data.desc);
    formData.append("categoryID", data.categoryID);
    if(data.showOnHomePage !== undefined && data.showOnHomePage !== null){ 
        formData.append("showOnHomePage",data.showOnHomePage.toString());
    }
    if(data.files){
        data.files.forEach((file) => {formData.append('files', file);});
    }
    
    
    const response = await axiosClient.patch(`/admin/posts`,formData,config) // ${document.cookie}
    return response.data
}
export const useModifyPost = () => {
    return useMutation( 
        {
            mutationFn: modifyPost,
            onSuccess(data){
                
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getPosts],
                                            exact: false})
                
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}

const deletePost = async (id:number) : Promise<string> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}`}
    };
    const response = await axiosClient.delete(`/admin/posts/${id}`,config) // ${document.cookie} //nem jó sajna delete csak 2 vel működik
    return response.data
}
export const usedeletePost = () => {
    const { setError } = useErrorHandler()

    const query = useMutation({
        mutationKey: [QUERY_KEYS.deleteImage],
        mutationFn: deletePost,
        onSuccess(data){
            queryClient.refetchQueries({queryKey:[QUERY_KEYS.getPosts],
                                            exact: false                                                        })
        }
    })

    if (query.error.value) {      
        setError(query.error.value)
    }
    return query
}


const deleteImage = async (deleted:number) : Promise<string> =>{
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.delete(`/admin/image/${deleted}`,config) // ${document.cookie} //nem jó sajna delete csak 2 vel működik
    return response.data
}
export const usedeleteImage = () => {
    const { setError } = useErrorHandler()

    const query = useMutation({
        mutationKey: [QUERY_KEYS.deleteImage],
        mutationFn: deleteImage,
        onSuccess(data){

        }
    })

    if (query.error.value) {
        setError(query.error.value)
    }
    return query
}


