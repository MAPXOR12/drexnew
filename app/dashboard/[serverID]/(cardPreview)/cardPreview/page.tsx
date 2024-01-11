"use client";

import NotFound from "@/app/not-found";
import LatestMessages from "@/components/cards/LatestMessages";
import ServerInfo from "@/components/cards/ServerInfo";
import ServerRules from "@/components/cards/ServerRules";
import { GradientTemplates } from "@/lib/constants/GradientTemplates";
import { CardBadge } from "@/lib/types/CardBadge";
import { CardBadgeIcons } from "@/lib/types/CardBadgeIcons";
import { CardData } from "@/lib/types/CardData";
import { CardFont } from "@/lib/types/CardFont";
import { CardFonts } from "@/lib/types/CardFonts";
import { CardGradients } from "@/lib/types/CardGradients";
import { APIGuild } from "discord-api-types/v10";
import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { useMediaQuery } from "react-responsive";


export default function DashboardCardPreview({ params: { serverID } }: { readonly params: { serverID: string }}) {
    const { data: server, status, error } = useQuery<APIGuild | { error: string }>(["server_list", serverID], async () => await fetch(`/api/v1/servers/${serverID}`).then(async (i) => await i.json().catch(() => undefined)).catch(() => undefined));
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const searchParams = useSearchParams();
    if (error || (server && 'error' in server)) return <NotFound/>; 
    const gradient = searchParams.get('bg_gradient');
    const header_font = searchParams.get('header_font') ?? 'BAUHAUS_93';
    const text_font = searchParams.get('text_font') ?? 'ROBOTO';
    const data: CardData = {
        badges: Object.keys(CardBadgeIcons) as CardBadge[],
        dark: searchParams.get('dark') == 'true' ? true : false,
        primary_color: searchParams.get('bg_color1') ?? "#000000",
        background: {
            color1: '#' + searchParams.get('bg_color1') ?? "#000000",
            color2: '#' + searchParams.get('bg_color2') ?? "#000000",
            gradient: (Object.entries(CardGradients).find((i) => i[0].toString() == gradient)?.[0] as CardGradients | undefined) ?? CardGradients.BACKGROUND,
        },
        server: {
            name: server?.name ?? 'Not Found',
            members: 0,
            icon_url: (server?.icon ?? undefined) && `https://cdn.discordapp.com/icons/${serverID}/${server?.icon}`,
            acronym: server?.name?.split(" ").map((i) => "abcdefghijklmnopqrstuvwxyz".indexOf(i[0]) != -1 ? i[0] : "").join("") ?? 'nf',
        },
        rules: searchParams.getAll('rules').slice(0, 10),
        invite_url: 'https://bot.auxdible.me',
        header_font: (Object.entries(CardFonts).find((i) => i[0].toString() == header_font)?.[0] as CardFont) ?? CardFonts.BAUHAUS_93,
        text_font: (Object.entries(CardFonts).find((i) => i[0].toString() == text_font)?.[0] as CardFont) ?? CardFonts.ROBOTO,
        featured: false,
        public: false,
        description: searchParams.get('description') ?? "",
    }
    const template = GradientTemplates[data?.background?.gradient || 'BACKGROUND'];
    return (<main className={`${data?.dark ? "bg-black" : "bg-gray-100"} ${data?.dark ? "text-gray-100" : "text-gray-800"}  flex flex-col max-md:p-1 justify-center items-center overflow-x-hidden`} style={{ backgroundImage: (template || GradientTemplates.BACKGROUND)(data?.background?.color1, data?.background?.color2)}}>
    <div className={"flex max-md:flex-col p-1 justify-center items-center min-h-screen w-full gap-20 max-md:mt-12 animate-fadeIn"}>
    {isMobile ? 
    <>
    {data && <ServerInfo data={data} serverID={serverID} />}
    {data?.rules && <ServerRules data={data} />}
    {data?.channel && <LatestMessages data={data} />}
    </>
    :
    <>
    {data?.channel && <LatestMessages data={data} />}
    {data && <ServerInfo data={data} serverID={serverID} />}
    {data?.rules && data?.rules.length > 0 && <ServerRules data={data} />}
    </>}
    </div>
    <span className={"text-xl w-fit py-2 max-md:my-5 max-md:text-center max-md:flex max-md:flex-col font-open-sans"}><span className={"bg-red-600 rounded-2xl border-gray-800 max-md:w-fit max-md:mx-auto border p-1 font-bold"}>ALPHA</span> This is a feature currently in extreme testing and development for Auxdibot and not the final product.</span>
    
</main>);
}