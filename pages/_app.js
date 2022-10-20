import '../styles/globals.css'
//import 'tailwindcss/tailwind.css'
import {SessionProvider} from "next-auth/react"
import {RecoilRoot} from "recoil"

//Start from 2:44:26

function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  return(

    <SessionProvider session={session}>

        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
        
    </SessionProvider>
    
  ) 
}

export default MyApp
