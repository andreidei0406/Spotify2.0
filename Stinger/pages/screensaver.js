import ScreensaverComponent from "@/components/ScreensaverComponent";
import { getSession } from "next-auth/react";
export default function Screensaver() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <ScreensaverComponent/>
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