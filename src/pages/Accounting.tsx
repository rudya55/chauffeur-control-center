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
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
            <TabsTrigger value="expenses">Dépenses</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
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
