
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast.success("Votre message a été envoyé avec succès");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };
  
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Contact" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-center mb-6 text-primary">
            <Mail className="w-12 h-12" />
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-4">
            Envoyez-nous un message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input 
                id="name"
                name="name"
                placeholder="Votre nom"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input 
                id="subject"
                name="subject"
                placeholder="Sujet de votre message"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message"
                name="message"
                placeholder="Votre message..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              <Send className="h-4 w-4" />
              Envoyer le message
            </Button>
          </form>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">Nous contacter</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mt-1 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <a 
                    href="mailto:contact@taxiapp.com" 
                    className="text-primary hover:underline"
                  >
                    contact@taxiapp.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mt-1 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <a 
                    href="tel:+33123456789" 
                    className="text-primary hover:underline"
                  >
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p>123 Avenue des Taxis</p>
                  <p>75001 Paris, France</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
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
          
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Comment puis-je devenir chauffeur ?</h3>
                <p className="text-muted-foreground">
                  Vous pouvez vous inscrire depuis notre site web en remplissant le formulaire dédié aux chauffeurs.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Comment sont calculés les tarifs ?</h3>
                <p className="text-muted-foreground">
                  Nos tarifs sont calculés en fonction de la distance, du temps de trajet et de la demande.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Comment annuler une réservation ?</h3>
                <p className="text-muted-foreground">
                  Vous pouvez annuler une réservation depuis la section "Réservations" de votre compte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
