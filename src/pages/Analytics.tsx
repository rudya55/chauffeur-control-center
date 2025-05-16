
import PageHeader from "@/components/PageHeader";

const Analytics = () => {
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="analytics" />
      
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Analyse des Données</h2>
        <p className="text-muted-foreground mb-4">
          Les graphiques et statistiques concernant vos performances apparaîtront ici.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Total des courses</h3>
            <p className="text-2xl font-bold">128</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Revenus du mois</h3>
            <p className="text-2xl font-bold">1,250 €</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Évaluation moyenne</h3>
            <p className="text-2xl font-bold">4.8 / 5</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Taux d'acceptation</h3>
            <p className="text-2xl font-bold">95%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
