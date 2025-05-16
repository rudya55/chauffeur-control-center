
import PageHeader from "@/components/PageHeader";

const Settings = () => {
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="settings" />
      
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Paramètres</h2>
        <p className="text-muted-foreground mb-4">
          Configurez vos préférences et paramètres du compte ici.
        </p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Profil</h3>
            <div className="border rounded-lg p-4">
              <p className="text-muted-foreground">Options de profil</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Notifications</h3>
            <div className="border rounded-lg p-4">
              <p className="text-muted-foreground">Paramètres de notification</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Paiement</h3>
            <div className="border rounded-lg p-4">
              <p className="text-muted-foreground">Méthodes de paiement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
