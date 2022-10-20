import {getProviders, signIn} from "next-auth/react"

function login({providers}) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
        <img className="w-52 mb-5" alt="Spotify icon" src="https://links.papareact.com/9xl" />
        {
            Object.values(providers).map((provider) => (
                <div key={provider.name}>
                    <button aria-label="Login with spotify" onClick={() => signIn(provider.id, {callbackUrl: "/"})} className="bg-[#18D860] text-white p-5 rounded-lg">Login with {provider.name}</button>
                </div>
            ))
        }
    </div>
  )
}

export default login


export async function getServerSideProps(){

    const providers = await getProviders();

    return{
        props: {
            providers
        }
    }
}