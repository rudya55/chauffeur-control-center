
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import { toast } from "sonner";

const AccountingHeader = () => {
  const { t } = useLanguage();
  
  const handleMenuAction = (action: string) => {
    toast.success(`Action "${action}" clicked`);
  };
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("accounting")}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleMenuAction("Option 1")}>
            Option 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuAction("Option 2")}>
            Option 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuAction("Option 3")}>
            Option 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AccountingHeader;
