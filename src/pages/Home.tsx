
import OnlineStatusToggle from "@/components/OnlineStatusToggle";
import Map from "@/components/Map";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";

const Home = () => {
  return (
    <div className="relative h-screen w-full p-0 overflow-hidden">
      {/* Map as background */}
      <div className="absolute inset-0 z-0">
        <Map />
      </div>
      
      {/* Status toggle at top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <OnlineStatusToggle />
      </div>

      {/* Page header with menu button only, no title */}
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm rounded-md">
        <PageHeader 
          title="" 
          showBackButton={false} 
          className="mb-0 px-2 py-1"
        />
      </div>
    </div>
  );
};

export default Home;
