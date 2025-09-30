import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  period: string;
  periodType: "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string;
  totalRides: number;
  totalAmount: number;
  commission: number;
  driverEarnings: number;
  status: "paid" | "pending";
}

const InvoiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState<string>("all");

  // Factures générées automatiquement par période
  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      period: "Semaine 8 - Février 2024",
      periodType: "weekly",
      startDate: "2024-02-19",
      endDate: "2024-02-25",
      totalRides: 42,
      totalAmount: 2850,
      commission: 570,
      driverEarnings: 2280,
      status: "paid"
    },
    {
      id: "2",
      period: "Semaine 7 - Février 2024",
      periodType: "weekly",
      startDate: "2024-02-12",
      endDate: "2024-02-18",
      totalRides: 38,
      totalAmount: 2450,
      commission: 490,
      driverEarnings: 1960,
      status: "paid"
    },
    {
      id: "3",
      period: "Janvier 2024",
      periodType: "monthly",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      totalRides: 156,
      totalAmount: 10240,
      commission: 2048,
      driverEarnings: 8192,
      status: "paid"
    },
    {
      id: "4",
      period: "Décembre 2023",
      periodType: "monthly",
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      totalRides: 148,
      totalAmount: 9850,
      commission: 1970,
      driverEarnings: 7880,
      status: "paid"
    },
    {
      id: "5",
      period: "Année 2023",
      periodType: "yearly",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      totalRides: 1842,
      totalAmount: 125680,
      commission: 25136,
      driverEarnings: 100544,
      status: "paid"
    },
    {
      id: "6",
      period: "Février 2024",
      periodType: "monthly",
      startDate: "2024-02-01",
      endDate: "2024-02-29",
      totalRides: 142,
      totalAmount: 9520,
      commission: 1904,
      driverEarnings: 7616,
      status: "pending"
    },
  ]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = periodFilter === "all" || invoice.periodType === periodFilter;
    return matchesSearch && matchesPeriod;
  });

  const handleDownloadPDF = (invoice: Invoice) => {
    toast.success(`Téléchargement de la facture ${invoice.period}`);
    // Ici, on générerait le PDF avec toutes les informations
  };

  const getPeriodColor = (type: Invoice["periodType"]) => {
    switch (type) {
      case "weekly":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300";
      case "monthly":
        return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300";
      case "yearly":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300";
    }
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    return status === "paid" ? (
      <Badge className="bg-green-500 hover:bg-green-600 text-white">Payée</Badge>
    ) : (
      <Badge className="bg-orange-500 hover:bg-orange-600 text-white">En attente</Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-t-4 border-t-indigo-500">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Mes Factures
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Factures générées automatiquement entre vous et la société de taxi
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une période..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
                <SelectItem value="yearly">Annuel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Liste des factures */}
          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune facture trouvée
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="hover-scale border-l-4 border-l-indigo-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{invoice.period}</h3>
                          <Badge className={`${getPeriodColor(invoice.periodType)} border`}>
                            {invoice.periodType === "weekly" && "Semaine"}
                            {invoice.periodType === "monthly" && "Mois"}
                            {invoice.periodType === "yearly" && "Année"}
                          </Badge>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Du {new Date(invoice.startDate).toLocaleDateString("fr-FR")} au{" "}
                          {new Date(invoice.endDate).toLocaleDateString("fr-FR")}
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Courses</p>
                            <p className="text-xl font-bold text-blue-600">{invoice.totalRides}</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="text-xl font-bold text-green-600">{invoice.totalAmount}€</p>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Commission</p>
                            <p className="text-xl font-bold text-orange-600">-{invoice.commission}€</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Vos gains</p>
                            <p className="text-xl font-bold text-purple-600">{invoice.driverEarnings}€</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleDownloadPDF(invoice)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManagement;
