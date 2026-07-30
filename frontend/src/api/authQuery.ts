import axiosClient from "@/lib/axios"
import type { LoginData ,ChangePasswordData,ChangeUserNameData } from "./auth"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useRoute, useRouter } from "vue-router"
import { QUERY_KEYS } from "@/utils/QueryKeys"
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useCookieHandler } from "@/stores/cookieHandler"
import { useErrorHandler } from "@/stores/errorHandler"


const Login = async (data: LoginData) : Promise<string> => {
    const response = await axiosClient.post('/login/', data)
    return response.data
} 
export const useLogin = () => {
    const { push } = useRouter();
    return useMutation({
        mutationFn: Login,
        mutationKey: [QUERY_KEYS.Login],
        onSuccess(data) {
            const { setBaseTime, setCookie } = useCookieHandler();
            const decoded: JwtPayload = jwtDecode(data); 
            //console.log(Math.floor((decoded.exp * 1000 - Date.now()) / 1000))
            if (decoded.exp !== undefined) {
                const d = new Date(0);
                d.setUTCSeconds(decoded.exp);
                setCookie("alap", data, d);
                setBaseTime(Math.floor((decoded.exp * 1000 - Date.now()) / 1000));
            } else {
                //console.warn("JWT token does not contain an expiration field.");
            }
            push({name: 'adminposts'});
        },
        onError(error) {
            const { setError } = useErrorHandler();
            setError(error);
        }
    });
};
