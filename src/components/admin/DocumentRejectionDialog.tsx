import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { documentRejectionSchema } from "@/lib/validations/auth";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

interface DocumentRejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => Promise<void>;
  documentName: string;
}

export const DocumentRejectionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  documentName,
}: DocumentRejectionDialogProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate input
    const validation = documentRejectionSchema.safeParse({ reason });
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setLoading(true);
    try {
      await onConfirm(validation.data.reason);
      setReason("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeter le document</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de rejeter "{documentName}". Veuillez indiquer la raison du rejet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejection-reason">Raison du rejet *</Label>
          <Textarea
            id="rejection-reason"
            placeholder="Ex: Document illisible, informations manquantes, document expiré..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Minimum 10 caractères, maximum 500 caractères
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setReason("");
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejeter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
