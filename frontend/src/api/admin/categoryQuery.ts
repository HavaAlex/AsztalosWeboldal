import axiosClient from "@/lib/axios"
import type { Category } from "./category"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler"
import { useErrorHandler } from "@/stores/errorHandler"
import queryClient from "@/lib/queryClient";


//Category
 const getCategories = async () : Promise<Category[]> => {
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.get('/admin/categories',config)
    console.log(response.data);
    return response.data
} 
export const useGetCategories = () => {
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getCategoriesAdmin],
        queryFn: getCategories,
    })

    if (query.error.value) {
        setError(query.error.value)
    }
    
    return query
};


const addCategory = async (data: Category) : Promise<Category> =>{
    console.log("aaa: " , data);
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    }; 
   
    const response = await axiosClient.post(`/admin/categories`,{data},config) // ${document.cookie}
    return response.data
}
export const useAddCategory = () => {
    return useMutation( 
        {
            mutationFn: addCategory,
            onSuccess(data){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getCategoriesAdmin]})
                
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}


const deleteCategory = async (ID:number)=>{ 
    const {getCookie} = useCookieHandler()
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    }; 
    const response = await axiosClient.delete(`/admin/categories/${ID}`,config) // ${document.cookie}
    return response.data
}
export const useDeleteCategory = () => {
    return useMutation( 
        {
            mutationFn: deleteCategory,
            onSuccess(){
                queryClient.refetchQueries({queryKey:[QUERY_KEYS.getCategoriesAdmin]})
            },
            onError(error){
                const {setError} = useErrorHandler()
                setError(error)
            }
        }
    )
}


const modifyCategory = async (data: Category) => {
    const { getCookie } = useCookieHandler() 
    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    };
    const response = await axiosClient.put(`/admin/categories`, {data}, config)
    return response.data
}
export const useModifyCategory= () => {
    return useMutation({
        mutationFn: modifyCategory,
        mutationKey: [QUERY_KEYS.modifyCategory],
        onSuccess() {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getCategoriesAdmin] })
        },
        onError(error) {
            const { setError } = useErrorHandler()
            setError(error)
        }
    })
}

