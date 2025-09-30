import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
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
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", date: "2024-01-05", category: "Carburant", description: "Plein essence", amount: 80 },
    { id: "2", date: "2024-01-10", category: "Maintenance", description: "Révision véhicule", amount: 250 },
    { id: "3", date: "2024-01-15", category: "Assurance", description: "Prime mensuelle", amount: 120 },
    { id: "4", date: "2024-01-20", category: "Péage", description: "Autoroute A1", amount: 15 },
    { id: "5", date: "2024-02-05", category: "Carburant", description: "Plein diesel", amount: 75 },
  ]);

  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
  });

  const categories = ["Carburant", "Maintenance", "Assurance", "Péage", "Autre"];

  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    value,
    fill: `hsl(var(--chart-${index + 1}))`,
  }));

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const expense: Expense = {
      id: String(expenses.length + 1),
      date: new Date().toISOString().split("T")[0],
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
    };

    setExpenses([...expenses, expense]);
    setNewExpense({ category: "", description: "", amount: "" });
    toast.success("Dépense ajoutée avec succès");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    toast.success("Dépense supprimée");
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des dépenses</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
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
                      <Label htmlFor="category">Catégorie</Label>
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
                      <Label htmlFor="amount">Montant (€)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddExpense} className="w-full">
                      Ajouter la dépense
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Total des dépenses: <span className="text-lg font-bold">{totalExpenses.toFixed(2)}€</span>
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.amount}€</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={chartData}
              index="name"
              category="value"
              colors={["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"]}
              valueFormatter={(value) => `${value}€`}
              className="h-80"
            />
            <div className="mt-4 space-y-2">
              {Object.entries(categoryTotals).map(([category, total]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm">{category}</span>
                  <span className="font-medium">{total}€</span>
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
