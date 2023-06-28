import GameArtist from "@/components/GameArtist";
import { getSession } from "next-auth/react";
export default function Artist() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <GameArtist/>
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
