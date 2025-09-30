import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Download, Eye } from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  number: string;
  client: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

const InvoiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "1", number: "FAC-2024-001", client: "Jean Martin", date: "2024-01-15", amount: 450, status: "paid" },
    { id: "2", number: "FAC-2024-002", client: "Marie Dubois", date: "2024-01-20", amount: 380, status: "paid" },
    { id: "3", number: "FAC-2024-003", client: "Pierre Durand", date: "2024-02-05", amount: 520, status: "pending" },
    { id: "4", number: "FAC-2024-004", client: "Sophie Bernard", date: "2024-02-10", amount: 290, status: "overdue" },
    { id: "5", number: "FAC-2024-005", client: "Luc Petit", date: "2024-02-18", amount: 610, status: "paid" },
  ]);

  const [newInvoice, setNewInvoice] = useState({
    client: "",
    amount: "",
    description: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants = {
      paid: { label: "Payée", className: "bg-green-500 hover:bg-green-600 text-white" },
      pending: { label: "En attente", className: "bg-orange-500 hover:bg-orange-600 text-white" },
      overdue: { label: "En retard", className: "bg-red-500 hover:bg-red-600 text-white" },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const handleCreateInvoice = () => {
    if (!newInvoice.client || !newInvoice.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const invoice: Invoice = {
      id: String(invoices.length + 1),
      number: `FAC-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      client: newInvoice.client,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(newInvoice.amount),
      status: "pending",
    };

    setInvoices([...invoices, invoice]);
    toast.success(`Facture ${invoice.number} créée avec succès`);
    setNewInvoice({ client: "", amount: "", description: "" });
    setIsDialogOpen(false);
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    toast.success(`Téléchargement de la facture ${invoice.number} en PDF`);
  };

  const handleUpdateStatus = (id: string, newStatus: Invoice["status"]) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status: newStatus } : inv
    ));
    toast.success("Statut de la facture mis à jour");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Gestion des factures</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle facture
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle facture</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="client">Client *</Label>
                    <Input
                      id="client"
                      placeholder="Nom du client"
                      value={newInvoice.client}
                      onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Montant (€) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Description de la prestation"
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateInvoice} className="w-full bg-blue-600 hover:bg-blue-700">
                    Créer la facture
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Numéro</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Montant</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="font-semibold">{invoice.amount}€</TableCell>
                    <TableCell>
                      <div 
                        className="cursor-pointer inline-block"
                        onClick={() => {
                          const statuses: Invoice["status"][] = ["pending", "paid", "overdue"];
                          const currentIndex = statuses.indexOf(invoice.status);
                          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                          handleUpdateStatus(invoice.id, nextStatus);
                        }}
                      >
                        {getStatusBadge(invoice.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-300">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDownloadPDF(invoice)}
                          className="hover:bg-green-50 hover:border-green-300"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManagement;
