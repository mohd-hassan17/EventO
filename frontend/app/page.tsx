'use client'

import EventFlowHomepage from "@/components/home/Home";
import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useRedirect";
import { useState } from "react";

export default function Home() {

  const [isOpen, setOpen] = useState(false);
  const { logout, user, userLoginStatus, handlerUserInput,
    userState, updateUser, updateState, handleUpdateInput,
    emailVerification, allUsers, deleteUser } = useUserContext();

  const { name, photo, bio, isVerified } = user

  
  return (
    <main>
      <EventFlowHomepage />
    </main>
  );
}
