import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img
        className="w-52 h-52 mb-5"
        src="https://i.imgur.com/RL8Y2R8.png"
        alt=""
      />

      {Object.values(providers).map((provider) => (
        <div className="flex flex-col gap-3" key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-lg"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
          <button
            className="bg-[#18D860] text-white p-5 rounded-lg"
            onClick={() =>
              window.open(
                "https://www.spotify.com/ro-ro/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F%3F"
              )
            }
          >
            Register with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();
  console.log(providers);
  return {
    props: {
      providers,
    },
  };
}
