
import { Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Nous contacter</h1>
      
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex items-center justify-center mb-6 text-primary">
          <Mail className="w-12 h-12" />
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-4">
          Envoyez-nous un message
        </h2>
        
        <p className="text-center mb-6 text-muted-foreground">
          Pour toute question ou assistance, veuillez nous contacter par email.
          Notre équipe vous répondra dans les plus brefs délais.
        </p>
        
        <div className="flex justify-center">
          <a 
            href="mailto:contact@taxiapp.com" 
            className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md"
          >
            <Mail className="mr-2 h-5 w-5" />
            contact@taxiapp.com
          </a>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Heures d'assistance</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Lundi - Vendredi</span>
            <span>8h - 20h</span>
          </div>
          <div className="flex justify-between">
            <span>Samedi</span>
            <span>9h - 18h</span>
          </div>
          <div className="flex justify-between">
            <span>Dimanche</span>
            <span>10h - 16h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
