
import AccountingHeader from "@/components/accounting/AccountingHeader";

const Accounting = () => {
  return (
    <div className="p-4 sm:p-6">
      <AccountingHeader />
      
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Comptabilité</h2>
        <p className="text-muted-foreground mb-4">
          Gérez vos revenus, dépenses et factures dans cette section.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Revenus du mois</h3>
            <p className="text-2xl font-bold">1,250 €</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Dépenses du mois</h3>
            <p className="text-2xl font-bold">450 €</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Factures en attente</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Factures payées</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounting;
