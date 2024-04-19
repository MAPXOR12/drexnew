import Providers from '@/components/Providers'
import '@/styles/global.scss'
import { Metadata, Viewport } from 'next'
import { defaultMetadata } from '@/lib/constants/defaultMetadata';
import { defaultViewport } from '@/lib/constants/defaultViewport';
export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  ...defaultViewport,
  themeColor: "#ee884b",
  colorScheme: "dark",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className={"dark"} style={{ colorScheme: "dark" }}>

      <body className={"flex flex-col min-h-screen text-white bg-black"}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
