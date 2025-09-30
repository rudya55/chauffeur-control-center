import { useState } from "react";
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

  const [transactions] = useState<Transaction[]>([
    { id: "1", date: "2024-02-20", type: "revenue", category: "Course", description: "Paris - Orly", amount: 65 },
    { id: "2", date: "2024-02-20", type: "expense", category: "Carburant", description: "Station Total", amount: 45 },
    { id: "3", date: "2024-02-19", type: "revenue", category: "Course", description: "Gare du Nord - CDG", amount: 85 },
    { id: "4", date: "2024-02-19", type: "expense", category: "Péage", description: "Autoroute A1", amount: 8 },
    { id: "5", date: "2024-02-18", type: "revenue", category: "Course", description: "La Défense - Versailles", amount: 55 },
    { id: "6", date: "2024-02-18", type: "expense", category: "Maintenance", description: "Changement pneus", amount: 280 },
    { id: "7", date: "2024-02-17", type: "revenue", category: "Course", description: "Montparnasse - Le Bourget", amount: 72 },
    { id: "8", date: "2024-02-17", type: "expense", category: "Carburant", description: "Station Shell", amount: 50 },
    { id: "9", date: "2024-02-16", type: "revenue", category: "Course", description: "République - Roissy", amount: 95 },
    { id: "10", date: "2024-02-16", type: "expense", category: "Assurance", description: "Prime mensuelle", amount: 120 },
  ]);

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
