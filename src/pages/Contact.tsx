
import { Mail, MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Contact = () => {
  const handleMenuAction = (action: string) => {
    toast.success(`Action "${action}" clicked`);
  };
  
  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Nous contacter</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleMenuAction("Option 1")}>Option 1</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction("Option 2")}>Option 2</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction("Option 3")}>Option 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
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
