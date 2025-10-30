
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    problem: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Problem report submitted:", formData);
    toast.success("Votre signalement a été envoyé avec succès");
    setFormData({
      name: "",
      email: "",
      problem: "",
    });
  };
  
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Signaler un problème" />
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-center mb-6 text-destructive">
            <AlertTriangle className="w-12 h-12" />
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-6">
            Signaler un problème
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
              <Label htmlFor="problem">Description du problème</Label>
              <Textarea 
                id="problem"
                name="problem"
                placeholder="Décrivez le problème rencontré..."
                rows={6}
                value={formData.problem}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Envoyer le signalement
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
