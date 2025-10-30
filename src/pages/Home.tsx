
import OnlineStatusToggle from "@/components/OnlineStatusToggle";
import Map from "@/components/Map";

const Home = () => {
  return (
    <div className="relative h-screen w-full p-0 overflow-hidden">
      {/* Map as background - Full screen */}
      <div className="absolute inset-0 z-0">
        <Map />
      </div>
      
      {/* Status toggle at top center */}
      <div className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 z-10 w-auto px-2">
        <OnlineStatusToggle />
      </div>
    </div>
  );
};

export default Home;
