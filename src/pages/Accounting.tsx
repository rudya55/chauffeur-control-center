import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";
import PageHeader from "@/components/PageHeader";
import AccountingDashboard from "@/components/accounting/AccountingDashboard";
import InvoiceManagement from "@/components/accounting/InvoiceManagement";
import ExpenseManagement from "@/components/accounting/ExpenseManagement";
import FinancialReports from "@/components/accounting/FinancialReports";
import TransactionHistory from "@/components/accounting/TransactionHistory";

const Accounting = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={t("accounting")} 
        showBackButton={true}
      />
      
      <div className="container mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-card p-2 h-auto">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2">Tableau de bord</TabsTrigger>
            <TabsTrigger value="invoices" className="text-xs sm:text-sm py-2">Factures</TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs sm:text-sm py-2">Dépenses</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs sm:text-sm py-2">Rapports</TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm py-2">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AccountingDashboard />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoiceManagement />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseManagement />
          </TabsContent>

          <TabsContent value="reports">
            <FinancialReports />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Accounting;
