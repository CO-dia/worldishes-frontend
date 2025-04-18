import { ReactNode, Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import Header from "./Header";
import config from "@/config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";

// All the client wrappers are here (they can't be in server components)
// 1. SessionProvider: Allow the useSession from next-auth (find out if user is auth or not)
// 2. NextTopLoader: Show a progress bar at the top when navigating between pages
// 3. Toaster: Show Success/Error messages anywhere from the app with toast()
// 4. Tooltip: Show a tooltip if any JSX element has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content=""
// 5. CrispChat: Set Crisp customer chat support (see above)
const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  return (
    <>
      {/* Show a progress bar at the top when navigating between pages */}
      <NextTopLoader color={config.colors.main} showSpinner={false} />

      <Suspense fallback={<div>Loading...</div>}>
        <Header session={session} />
      </Suspense>

      <main className="flex flex-col my-10 w-[95vw] md:w-[80vw] lg:w-[75vw]">
        {/* Content inside app/page.js files  */}
        {children}
      </main>

      {/* Show Success/Error messages anywhere from the app with toast() */}
      <Toaster
        toastOptions={{
          duration: 3000,
          position: "bottom-right",
        }}
      />

      {/* Show a tooltip if any JSX element has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content="" */}
      {/* <Suspense>
        <Tooltip
          id="tooltip"
          className="z-[60] !opacity-100 max-w-sm shadow-lg"
        />
      </Suspense> */}
    </>
  );
};

export default Layout;
