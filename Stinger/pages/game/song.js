import GameSong from "@/components/GameSong";
import { getSession } from "next-auth/react";
export default function Song() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <GameSong />
      </main>
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
