import HomeCenter from "@/components/HomeCenter";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import { getSession } from "next-auth/react";
export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar className="bg-slate-500"/>
        <HomeCenter className="bg-slate-800"/>
      </main>

      <div className="sticky bottom-0">
        <Player/>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
