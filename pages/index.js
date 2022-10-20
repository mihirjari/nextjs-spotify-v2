import { getSession } from "next-auth/react"
import Head from "next/head"
import Center from "../components/Center"
import Player from "../components/Player"
import Sidebar from "../components/Sidebar"
export default function Home() {

  return (

    <>
      <Head>
        <title>Spotify V2</title>
        <link rel="icon" type="image/x-icon" href="https://links.papareact.com/9xl" />
      </Head>
      <div className="bg-black h-screen overflow-hidden">

          <main className="flex">

            {/* Sidebar */}

              <Sidebar />

            {/* Sidebar */}


            {/* Center */}

              <Center />

            {/* Center */}

          </main>

          <div className="sticky bottom-0">
            {/*Player*/}
            <Player />
          
          </div>
          
      </div>
    </>
    
  )
}

export async function getServerSideProps(context){

  const session = await getSession(context);
  return {
    props: {
      session,
    },
  }
}