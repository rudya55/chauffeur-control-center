
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Mail, Calendar, CalendarDays, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart } from "@/components/ui/chart";
import { toast } from "@/hooks/use-toast";

// Mock data for invoices
const invoices = [
  {
    id: "INV-001",
    date: "2025-05-14",
    client: "TaxiCorp",
    amount: "85.00",
    status: "paid"
  },
  {
    id: "INV-002",
    date: "2025-05-10",
    client: "VTCService",
    amount: "42.50",
    status: "pending"
  },
  {
    id: "INV-003",
    date: "2025-05-05",
    client: "LuxDrive",
    amount: "120.75",
    status: "paid"
  },
  {
    id: "INV-004",
    date: "2025-04-28",
    client: "TaxiCorp",
    amount: "65.20",
    status: "paid"
  }
];

// Mock data for charts
const dailyData = [
  { day: "Lun", revenue: 85, rides: 4 },
  { day: "Mar", revenue: 120, rides: 5 },
  { day: "Mer", revenue: 70, rides: 3 },
  { day: "Jeu", revenue: 95, rides: 4 },
  { day: "Ven", revenue: 150, rides: 7 },
  { day: "Sam", revenue: 200, rides: 10 },
  { day: "Dim", revenue: 180, rides: 8 }
];

const monthlyData = [
  { month: "Jan", revenue: 1200, rides: 45 },
  { month: "Fév", revenue: 1350, rides: 50 },
  { month: "Mar", revenue: 1500, rides: 55 },
  { month: "Avr", revenue: 1400, rides: 52 },
  { month: "Mai", revenue: 1650, rides: 63 },
  { month: "Juin", revenue: 1800, rides: 70 },
  { month: "Juil", revenue: 2000, rides: 78 },
  { month: "Août", revenue: 2100, rides: 80 },
  { month: "Sep", revenue: 1900, rides: 75 },
  { month: "Oct", revenue: 1700, rides: 65 },
  { month: "Nov", revenue: 1550, rides: 58 },
  { month: "Déc", revenue: 1800, rides: 72 }
];

const yearlyData = [
  { year: "2023", revenue: 18500, rides: 720 },
  { year: "2024", revenue: 21000, rides: 810 },
  { year: "2025", revenue: 7500, rides: 290 }
];

const Accounting = () => {
  const [activeTab, setActiveTab] = useState("day");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-secondary">Payée</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnue</Badge>;
    }
  };

  const handleDownloadInvoices = (period: string) => {
    toast({
      title: "Téléchargement des factures",
      description: `Les factures pour ${period} ont été téléchargées.`
    });
  };

  const formatEuro = (value: number) => `${value.toFixed(2)} €`;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Comptabilité</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">313,45 €</div>
            <p className="text-xs text-muted-foreground">
              +12.5% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Factures payées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 / 4</div>
            <p className="text-xs text-muted-foreground">
              75% des factures sont payées
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42,50 €</div>
            <p className="text-xs text-muted-foreground">
              1 facture en attente de paiement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse des revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="day" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="day">
                <Calendar className="h-4 w-4 mr-2" />
                Semaine
              </TabsTrigger>
              <TabsTrigger value="month">
                <CalendarDays className="h-4 w-4 mr-2" />
                Mois
              </TabsTrigger>
              <TabsTrigger value="year">
                <FileText className="h-4 w-4 mr-2" />
                Année
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="day">
              <div className="h-80">
                <AreaChart 
                  data={dailyData}
                  index="day"
                  categories={["revenue"]}
                  colors={["#1a73e8"]}
                  valueFormatter={formatEuro}
                  className="h-full"
                />
              </div>
              <div className="h-48 mt-4">
                <BarChart 
                  data={dailyData}
                  index="day"
                  categories={["rides"]}
                  colors={["#00a19d"]}
                  valueFormatter={(value) => `${value} courses`}
                  className="h-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadInvoices("cette semaine")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger les factures de la semaine
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="month">
              <div className="h-80">
                <AreaChart 
                  data={monthlyData}
                  index="month"
                  categories={["revenue"]}
                  colors={["#1a73e8"]}
                  valueFormatter={formatEuro}
                  className="h-full"
                />
              </div>
              <div className="h-48 mt-4">
                <BarChart 
                  data={monthlyData}
                  index="month"
                  categories={["rides"]}
                  colors={["#00a19d"]}
                  valueFormatter={(value) => `${value} courses`}
                  className="h-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadInvoices("ce mois")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger les factures du mois
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="year">
              <div className="h-80">
                <AreaChart 
                  data={yearlyData}
                  index="year"
                  categories={["revenue"]}
                  colors={["#1a73e8"]}
                  valueFormatter={formatEuro}
                  className="h-full"
                />
              </div>
              <div className="h-48 mt-4">
                <BarChart 
                  data={yearlyData}
                  index="year"
                  categories={["rides"]}
                  colors={["#00a19d"]}
                  valueFormatter={(value) => `${value} courses`}
                  className="h-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadInvoices("cette année")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger les factures de l'année
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Invoices table */}
      <Card>
        <CardHeader>
          <CardTitle>Factures</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell className="text-right">{invoice.amount} €</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => alert(`Télécharger la facture ${invoice.id}`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => alert(`Envoyer par email la facture ${invoice.id}`)}
                      >
                        <Mail className="h-4 w-4" />
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

export default Accounting;
