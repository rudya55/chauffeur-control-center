import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { PieChart } from "@/components/ui/chart";
import { toast } from "sonner";

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchExpenses();
    
    const channel = supabase
      .channel('expense-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'accounting_transactions'
        },
        () => {
          fetchExpenses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('accounting_transactions')
      .select('*')
      .eq('transaction_type', 'expense')
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return;
    }

    const formattedExpenses: Expense[] = (data || []).map(e => ({
      id: e.id,
      date: e.transaction_date.split('T')[0],
      category: e.category,
      description: e.description || '',
      amount: Number(e.amount)
    }));

    setExpenses(formattedExpenses);
  };

  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = ["Maintenance", "Assurance", "Péage", "Parking", "Nettoyage", "Autre"];

  const categoryColors: Record<string, string> = {
    Maintenance: "hsl(142, 76%, 36%)",
    Assurance: "hsl(217, 91%, 60%)",
    Péage: "hsl(48, 96%, 53%)",
    Parking: "hsl(280, 87%, 65%)",
    Nettoyage: "hsl(31, 97%, 72%)",
    Autre: "hsl(0, 0%, 60%)",
  };

  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    fill: categoryColors[name] || categoryColors["Autre"],
  }));

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const { error } = await supabase
      .from('accounting_transactions')
      .insert({
        transaction_type: 'expense',
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        transaction_date: new Date().toISOString(),
        payment_status: 'completed'
      });

    if (error) {
      toast.error("Erreur lors de l'ajout de la dépense");
      console.error('Error adding expense:', error);
      return;
    }

    setNewExpense({ category: "", description: "", amount: "" });
    toast.success("Dépense ajoutée avec succès");
    setIsDialogOpen(false);
  };

  const handleDeleteExpense = async (id: string) => {
    const { error } = await supabase
      .from('accounting_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la suppression");
      console.error('Error deleting expense:', error);
      return;
    }

    toast.success("Dépense supprimée");
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      Maintenance: "bg-green-100 text-green-800 border-green-300",
      Assurance: "bg-blue-100 text-blue-800 border-blue-300",
      Péage: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Parking: "bg-purple-100 text-purple-800 border-purple-300",
      Nettoyage: "bg-orange-100 text-orange-800 border-orange-300",
      Autre: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return colors[category] || colors["Autre"];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-t-4 border-t-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Liste des dépenses</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une dépense</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">Catégorie *</Label>
                      <Select
                        value={newExpense.category}
                        onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Description de la dépense"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Montant (€) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddExpense} className="w-full bg-purple-600 hover:bg-purple-700">
                      Ajouter la dépense
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Total des dépenses
              </p>
              <p className="text-3xl font-bold text-purple-600">{totalExpenses.toFixed(2)}€</p>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Catégorie</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Montant</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>{new Date(expense.date).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCategoryBadgeColor(expense.category)}`}>
                          {expense.category}
                        </span>
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="font-semibold">{expense.amount}€</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-pink-500">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-white dark:from-pink-950/20 dark:to-background">
            <CardTitle className="text-xl">Répartition par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={chartData}
              index="name"
              category="value"
              colors={Object.values(categoryColors)}
              valueFormatter={(value) => `${value}€`}
              className="h-80"
            />
            <div className="mt-6 space-y-2">
              {Object.entries(categoryTotals).map(([category, total]) => (
                <div key={category} className="flex justify-between items-center p-2 rounded hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: categoryColors[category] }}
                    ></div>
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <span className="font-bold text-lg">{total}€</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseManagement;
