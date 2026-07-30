import axiosClient from "@/lib/axios"
import type { ChangePasswordData, ChangeUserNameData } from "./auth"
import { useMutation } from "@tanstack/vue-query"
import { useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { useCookieHandler } from "@/stores/cookieHandler"
import { useErrorHandler } from "@/stores/errorHandler"

const ChangePassword = async (data: ChangePasswordData): Promise<string> => {
    const { getCookie } = useCookieHandler()

    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    }
    const response = await axiosClient.post('/login/changePassword/', { data }, config)
    return response.data
}

export const useChangePassword = () => {
    const cookieHandler = useCookieHandler()
    const { push } = useRouter()
    const { setError } = useErrorHandler()

    return useMutation({
        mutationFn: ChangePassword,
        mutationKey: [QUERY_KEYS.ChangePassword],
        onSuccess() {
            cookieHandler.deleteCookie('alap')
            push({ name: 'login' })
        },
        onError(error) {
            setError(error)
        }
    })
}

const ChangeUsername = async (data: ChangeUserNameData): Promise<string> => {
    const { getCookie } = useCookieHandler()

    const config = {
        headers: { Authorization: `Bearer ${getCookie("alap")}` }
    }

    const response = await axiosClient.post('/login/changeUsername/', { data }, config)
    return response.data
}

export const useChangeUsername = () => {
    const cookieHandler = useCookieHandler()
    const { push } = useRouter()
    const { setError } = useErrorHandler()

    return useMutation({
        mutationFn: ChangeUsername,
        mutationKey: [QUERY_KEYS.ChangeUsername],
        onSuccess() {
            cookieHandler.deleteCookie('alap')
            push({ name: 'login' })
        },
        onError(error) {
            setError(error)
        }
    })
}