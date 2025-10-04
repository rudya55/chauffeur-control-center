import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, FileText, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const InvoiceManagement = () => {
  const [periodType, setPeriodType] = useState<"day" | "week" | "month" | "year">("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [invoiceData, setInvoiceData] = useState({
    totalRides: 0,
    totalAmount: 0,
    commission: 0,
    driverEarnings: 0,
  });

  useEffect(() => {
    fetchInvoiceData();
  }, [periodType, selectedDate]);

  const fetchInvoiceData = async () => {
    const { start, end } = getPeriodDates();
    
    const { data: reservations, error: resError } = await supabase
      .from('reservations')
      .select('*')
      .eq('status', 'completed')
      .gte('dropoff_time', start.toISOString())
      .lte('dropoff_time', end.toISOString());

    if (resError) {
      console.error('Error fetching invoice data:', resError);
      return;
    }

    const totalRides = reservations?.length || 0;
    const totalAmount = reservations?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
    const commission = reservations?.reduce((sum, r) => sum + Number(r.commission), 0) || 0;
    const driverEarnings = reservations?.reduce((sum, r) => sum + Number(r.driver_amount), 0) || 0;

    setInvoiceData({
      totalRides,
      totalAmount,
      commission,
      driverEarnings,
    });
  };

  // Fonction pour calculer les dates de début et fin selon le type de période
  const getPeriodDates = () => {
    switch (periodType) {
      case "day":
        return { start: selectedDate, end: selectedDate };
      case "week":
        return { start: startOfWeek(selectedDate, { weekStartsOn: 1 }), end: endOfWeek(selectedDate, { weekStartsOn: 1 }) };
      case "month":
        return { start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) };
      case "year":
        return { start: startOfYear(selectedDate), end: endOfYear(selectedDate) };
    }
  };

  const { start, end } = getPeriodDates();

  const handleDownloadPDF = () => {
    const periodLabel = periodType === "day" ? "Journée" : periodType === "week" ? "Semaine" : periodType === "month" ? "Mois" : "Année";
    toast.success(`Téléchargement de la facture - ${periodLabel} du ${format(start, "dd/MM/yyyy", { locale: fr })} au ${format(end, "dd/MM/yyyy", { locale: fr })}`);
  };

  const getPeriodLabel = () => {
    switch (periodType) {
      case "day":
        return format(selectedDate, "dd MMMM yyyy", { locale: fr });
      case "week":
        return `Semaine du ${format(start, "dd MMM", { locale: fr })} au ${format(end, "dd MMM yyyy", { locale: fr })}`;
      case "month":
        return format(selectedDate, "MMMM yyyy", { locale: fr });
      case "year":
        return format(selectedDate, "yyyy", { locale: fr });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-t-4 border-t-primary">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-background">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Mes Factures
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Générez et téléchargez vos factures entre vous et la société de taxi
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Sélection de la période */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Type de période</label>
                <Select value={periodType} onValueChange={(value: any) => setPeriodType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Journée</SelectItem>
                    <SelectItem value="week">Semaine</SelectItem>
                    <SelectItem value="month">Mois</SelectItem>
                    <SelectItem value="year">Année</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Sélectionner une date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Récapitulatif de la facture */}
          <Card className="border-l-4 border-l-primary shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* En-tête */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{getPeriodLabel()}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Du {format(start, "dd/MM/yyyy", { locale: fr })} au {format(end, "dd/MM/yyyy", { locale: fr })}
                    </p>
                  </div>
                  <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2">
                    {periodType === "day" && "Journée"}
                    {periodType === "week" && "Semaine"}
                    {periodType === "month" && "Mois"}
                    {periodType === "year" && "Année"}
                  </Badge>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Nombre de courses</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{invoiceData.totalRides}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Chiffre total</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{invoiceData.totalAmount}€</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Commission (20%)</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">-{invoiceData.commission}€</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Net chauffeur</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{invoiceData.driverEarnings}€</p>
                  </div>
                </div>

                {/* Détails supplémentaires */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Chiffre d'affaires brut</span>
                    <span className="font-semibold">{invoiceData.totalAmount}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Commission société (20%)</span>
                    <span className="font-semibold text-orange-600">-{invoiceData.commission}€</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Net à payer chauffeur</span>
                    <span className="font-bold text-primary">{invoiceData.driverEarnings}€</span>
                  </div>
                </div>

                {/* Bouton téléchargement */}
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Télécharger la facture PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManagement;
