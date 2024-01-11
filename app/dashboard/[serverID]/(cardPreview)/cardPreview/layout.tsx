import { Metadata } from "next";
import '@/styles/global.scss'

interface CardPreviewProps {
    params: { readonly serverID: string }
    children: React.ReactNode
    searchParams: { [key: string]: string }
}

export async function generateMetadata({ searchParams, params: { serverID } }: CardPreviewProps): Promise<Metadata> {
    const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/servers/${serverID}`).then(async (i) => await i.json().catch(() => undefined)).catch(() => undefined);
    const description = searchParams?.description ?? "A server card created utilizing Auxdibot's card system.";
    return {
        title: 'Preview Card',
        description: description + "\n\nThis is a preview card generated by Auxdibot. Only people with access to Auxdibot's dashboard for this server can view this.",
        themeColor: "#000000",
        openGraph: {
            title: 'Preview Card',
            description: description + "\n\nThis is a preview card generated by Auxdibot. Only people with access to Auxdibot's dashboard for this server can view this.",
            siteName: 'Auxdibot',
            type: 'website',
            url: 'https://bot.auxdible.me'
        }
    }
}


export default function ServerCardPreviewLayout({ children }: CardPreviewProps) {
    // extra div element here is to render in all card fonts to tailwind
    return (<div>
    <div className={"font-roboto font-lato font-playfair-display font-inter font-josefin-slab font-oswald font-bauhaus font-raleway"}/>
    <h1 className={"text-lg text-center font-montserrat font-bold text-gradient mx-auto"}>THIS IS A PREVIEW; CARD BADGES AND MEMBERS ARE NOT REFLECTIVE OF YOUR SERVER.</h1>
    {children}
    </div>)
}