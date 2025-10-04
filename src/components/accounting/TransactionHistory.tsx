import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  date: string;
  type: "revenue" | "expense";
  category: string;
  description: string;
  amount: number;
}

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
    
    const channel = supabase
      .channel('transaction-history-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'accounting_transactions'
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('accounting_transactions')
      .select('*')
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    const formattedTransactions: Transaction[] = (data || []).map(t => ({
      id: t.id,
      date: t.transaction_date,
      type: t.transaction_type as "revenue" | "expense",
      category: t.category,
      description: t.description || '',
      amount: Number(t.amount)
    }));

    setTransactions(formattedTransactions);
  };

  const filteredTransactions = transactions
    .filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      return (
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalRevenue = transactions
    .filter((t) => t.type === "revenue")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenus</p>
                <p className="text-2xl font-bold text-green-600">{totalRevenue}€</p>
              </div>
              <ArrowUpCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Dépenses</p>
                <p className="text-2xl font-bold text-red-600">{totalExpense}€</p>
              </div>
              <ArrowDownCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Solde Net</p>
                <p className="text-2xl font-bold">{(totalRevenue - totalExpense)}€</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="revenue">Revenus</SelectItem>
                <SelectItem value="expense">Dépenses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    {transaction.type === "revenue" ? (
                      <Badge className="bg-green-500">Revenu</Badge>
                    ) : (
                      <Badge className="bg-red-500">Dépense</Badge>
                    )}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`text-right font-medium ${transaction.type === "revenue" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "revenue" ? "+" : "-"}{transaction.amount}€
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

export default TransactionHistory;
