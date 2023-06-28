import GameComponent from "@/components/GameComponent";
import { getSession } from "next-auth/react";
export default function Game() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <GameComponent/>
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
