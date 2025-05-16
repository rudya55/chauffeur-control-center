
import PageHeader from "@/components/PageHeader";

const Calendar = () => {
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="planning" />
      
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Calendrier des réservations</h2>
        <p className="text-muted-foreground">
          Votre calendrier de planification sera affiché ici.
        </p>
      </div>
    </div>
  );
};

export default Calendar;
