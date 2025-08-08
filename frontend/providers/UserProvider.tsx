'use client'

import {UserContextProvider} from "../context/userContext.js"

interface Props {
    children: React.ReactNode
}

const UserProvider = ({children}: Props) => {
    return (
    <UserContextProvider>
        {children}
    </UserContextProvider>
    )
}

export default UserProvider;