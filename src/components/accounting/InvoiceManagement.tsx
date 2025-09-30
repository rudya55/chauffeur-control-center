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
  const [invoices] = useState<Invoice[]>([
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

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants = {
      paid: { label: "Payée", className: "bg-green-500" },
      pending: { label: "En attente", className: "bg-orange-500" },
      overdue: { label: "En retard", className: "bg-red-500" },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const handleCreateInvoice = () => {
    if (!newInvoice.client || !newInvoice.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    toast.success("Facture créée avec succès");
    setNewInvoice({ client: "", amount: "", description: "" });
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    toast.success(`Téléchargement de la facture ${invoice.number}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestion des factures</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
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
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      placeholder="Nom du client"
                      value={newInvoice.client}
                      onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Montant (€)</Label>
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
                  <Button onClick={handleCreateInvoice} className="w-full">
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{invoice.amount}€</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(invoice)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManagement;
