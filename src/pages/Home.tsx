
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
      <div className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 z-10 w-auto px-2">
        <OnlineStatusToggle />
      </div>

      {/* Page header with menu button only, no title */}
      <div className="absolute top-3 sm:top-4 left-2 sm:left-4 z-10">
        <PageHeader 
          title="" 
          showBackButton={false} 
          className="mb-0 p-0"
        />
      </div>
    </div>
  );
};

export default Home;
