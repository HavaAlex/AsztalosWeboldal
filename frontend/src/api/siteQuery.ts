import axiosClient from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import type { Post } from "./admin/post"
import type { Category } from "./site";
import queryClient from "@/lib/queryClient";
import { useErrorHandler } from "@/stores/errorHandler";
import { ref, computed, onMounted, onUnmounted, watch, type Ref, type ComputedRef } from 'vue';
import type { SortKey,SortOrd,SortOption } from '@/api/site'

const getCategories = async (): Promise<Category[]> => {
    const response = await axiosClient.get(`/viewer/categories`)
    return response.data
}
export const useGetCategories = () => {
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getCategories],
        queryFn: getCategories,
    })
   
    if (query.error.value) {
        setError(query.error.value)
    }

    return query
}

const getPosts = async (data: Number[]) : Promise<Post[]> =>{ //a data a már lefetchelt postok id-ja
    const config = {
        headers: { IDs:data.map(String)}
    }; 
    const response = await axiosClient.get(`/viewer/posts`,config) 
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


const getPostsByCategory = async ({queryKey}:any ) : Promise<Post[]> =>{ //a data a már lefetchelt postok id-ja
    const [_key, data, category,sortkey,sortord] = queryKey
    
    const config = {
        headers: {IDs:data.map(String)}
    }; 
    const response = await axiosClient.get(`/viewer/posts/${category}/${sortkey}/${sortord}`,config) // ${document.cookie}
    return response.data
}

export const useGetPostsByCategory = (   data: Ref<number[]>,category: ComputedRef<number>, sortkey:Ref<SortKey>, sortord:Ref<SortOrd>) => {
    const { setError } = useErrorHandler()

    const query = useQuery({
        queryKey: [QUERY_KEYS.getPosts,data,category,sortkey,sortord],
        queryFn: getPostsByCategory
    })

    if (query.error.value) {
        setError(query.error.value)
    }
    return query
}

const getPostsByNewest = async (data:Number[] ) : Promise<Post[]> =>{ //a data a már lefetchelt postok id-ja
    const config = {
        headers: {IDs:data.map(String)}
    }; 
    const response = await axiosClient.get(`/viewer/posts/newest`,config) 
    return response.data
}

export const useGetPostsByNewest = () => {
    const { setError } = useErrorHandler()

    const query = useMutation({
        mutationKey: [QUERY_KEYS.getPostsByNewest],
        mutationFn: getPostsByNewest
    })

    if (query.error.value) {
        setError(query.error.value)
    }
    return query
}