
import { Outlet } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import LocationGuard from "@/components/LocationGuard";

const AppLayout = () => {
  return (
    <LocationGuard>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/30 w-full pb-20">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </LocationGuard>
  );
};

export default AppLayout;
