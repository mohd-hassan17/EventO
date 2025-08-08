
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const useRedirect = (redirect: string) => {
    const router = useRouter();
    const {userLoginStatus} = useUserContext();

        useEffect(() => {
            const redirectUser = async () => {
                const isLoggedInUser = await userLoginStatus();

                if(!isLoggedInUser){
                    router.push(redirect);
                }
            }
            redirectUser();
        },[redirect, userLoginStatus, router])
    
}

export default useRedirect;