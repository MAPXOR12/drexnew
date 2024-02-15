"use client";

import Image from "next/image";
import { BsArrowDownShort, BsArrowRightCircle, BsListTask, BsPersonAdd, BsShield, BsThreeDots } from "react-icons/bs";
import { useEffect, useRef, useState } from 'react';
import useSession from "@/lib/hooks/useSession";
import { BsArrowLeftCircle } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "react-query";
import { UserBadgeIcons } from "@/lib/constants/UserBadgeIcons";
import { UserBadge } from "@/lib/types/UserBadge";
export default function MiniProfile(props: React.ComponentProps<any>) {
    const [expanded, setExpanded] = useState(false);
    const { user, status } = useSession();
    const queryClient = useQueryClient();
    const router = useRouter();
    const ref = useRef<HTMLDivElement | null>();
    useEffect(() => {
        const clickedOutside = (e: globalThis.MouseEvent) => {
          if (expanded && ref.current && !ref.current.contains(e.target as Node)) setExpanded(false)
          
        }
        document.addEventListener("mousedown", clickedOutside)
        return () => document.removeEventListener("mousedown", clickedOutside);
      }, [expanded])
    function expand() {
        setExpanded(!expanded)
    }
    function signOut() {
        return fetch(`/api/v1/auth/signout`).then(() => {
            setExpanded(false);
            queryClient.invalidateQueries("session");
        }).catch(() => undefined)
    }
    if (status == "loading") return (<div {...props}>
        <BsThreeDots className={"animate-spin text-2xl text-white"}/>
    </div>)
    return (<div ref={ref} {...props}>
        <span className={"text-primary-300"}></span>
        <span className={`flex flex-row gap-2`}>
        {user?.badges && <span className={"flex flex-row mx-auto text-base max-md:gap-1 md:gap-2 bg-gray-900 py-1 px-2 justify-center rounded-2xl w-fit items-center"}>
            {user?.badges?.map((i: UserBadge) => 
                <span className={"flex flex-col relative group"} key={i}>
                    {UserBadgeIcons[i]} 
                    <span className={'absolute -z-10 group-hover:scale-100 scale-0 origin-top bg-gray-950 border border-gray-500 rounded-2xl transition-all px-1 font-open-sans translate-x-1/2 right-1/2 w-max top-8'}>{i.split('_').map((i) => i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase()).join(' ')}</span></span>
            )}
        </span>}
        <span className={"flex items-center gap-2"}>
        {status == "authenticated" && user?.avatar && user?.id ? <Image
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
            alt={"Discord profile icon"}
            className={"inline-block align-middle rounded-xl"}
            width={36}
            height={36}
            quality="100"
            priority
            /> : <BsPersonAdd className={"text text-2xl align-middle inline-block"}/>}
        
        <span className={"flex group flex-row gap-2 items-center text-gray-200 font-montserrat tracking-wide text-lg cursor-pointer"} onClick={() => expand()}>
        <span className={"max-md:hidden select-none"}>{user?.username || "Sign in"}</span>
        
        <BsArrowDownShort className={"group-hover:translate-y-1 transition-transform"}/>
        </span>
        

        </span>

        </span>
        <div className={`absolute ${expanded ? "scale-100" : "scale-0"} transition-all origin-top-right select-none top-14 z-10 ${user && 'translate-x-6' } max-md:-translate-x-8 bg-auxdibot-gradient bg-black border border-gray-950 rounded-xl`}>
            <h1 className={"secondary p-4 rounded-t-xl flex flex-row gap-2 items-center border-b border-gray-950"}><BsShield/> Account</h1>
            <ul className={"flex flex-col gap-2 p-4"}>
            {status == "authenticated" ? 
            <Link href={"/dashboard"} onClick={() => setExpanded(false)}  className={"flex flex-row gap-2 items-center font-roboto text-gray-300 transition-colors group cursor-pointer"}><span className={"bg-gray-800 p-1 rounded-lg text-gray-300 group-hover:text-orange-500 bg-opacity-50 transition-all"}><BsListTask/></span>Servers</Link> : ""}
                {status == "unauthenticated" ? <span onClick={() => router.push('/api/v1/auth/discord')} className={"flex flex-row gap-2 items-center font-roboto text-gray-300 transition-colors group cursor-pointer"}><span className={"bg-gray-800 p-1 rounded-lg text-gray-300 group-hover:text-orange-500 bg-opacity-50 transition-all"}><BsArrowRightCircle/></span>Sign in</span>
                : <span onClick={() => signOut()} className={"flex flex-row gap-2 items-center font-roboto text-gray-300 transition-colors group cursor-pointer"}><span className={"bg-gray-800 p-1 rounded-lg text-gray-300 group-hover:text-orange-500 bg-opacity-50 transition-all"}><BsArrowLeftCircle/></span>Sign out</span> }
            </ul>
        </div>
    </div>)
}