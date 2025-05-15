
import OnlineStatusToggle from "@/components/OnlineStatusToggle";
import Map from "@/components/Map";
import { useState } from "react";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
    const event = new CustomEvent('toggle-sidebar');
    window.dispatchEvent(event);
  };

  return (
    <div className="relative h-screen w-full p-0 overflow-hidden">
      {/* Map as background */}
      <div className="absolute inset-0 z-0">
        <Map onMenuToggle={handleMenuToggle} />
      </div>
      
      {/* Status toggle at top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <OnlineStatusToggle />
      </div>
    </div>
  );
};

export default Home;
