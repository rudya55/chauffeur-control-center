import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, FileText, Users, Plus } from "lucide-react";
import { DocumentRejectionDialog } from "@/components/admin/DocumentRejectionDialog";
import CreateReservationForm from "@/components/reservation/CreateReservationForm";
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
} from "@/components/ui/dialog";

interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  status: string;
}

interface UserDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_name: string;
  document_url: string;
  uploaded_at: string;
  status: string;
  rejection_reason: string | null;
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<UserDocument | null>(null);

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (error || !data) {
      toast.error("Accès refusé - Réservé aux administrateurs");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    loadPendingUsers();
    setLoading(false);
  };

  const loadPendingUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
      return;
    }

    setPendingUsers(data || []);
  };

  const loadUserDocuments = async (userId: string) => {
    const { data, error } = await supabase
      .from("driver_documents")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      toast.error("Erreur lors du chargement des documents");
      return;
    }

    setUserDocuments(data || []);
  };

  const handleViewDocuments = async (user: PendingUser) => {
    setSelectedUser(user);
    await loadUserDocuments(user.id);
    setShowDocumentsDialog(true);
  };

  const handleApproveUser = async (userId: string) => {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ status: "approved" })
      .eq("id", userId);

    if (profileError) {
      toast.error("Erreur lors de l'approbation");
      return;
    }

    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "driver" });

    if (roleError) {
      toast.error("Erreur lors de l'attribution du rôle");
      return;
    }

    toast.success("Utilisateur approuvé avec succès");
    loadPendingUsers();
    setShowDocumentsDialog(false);
  };

  const handleRejectUser = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "rejected" })
      .eq("id", userId);

    if (error) {
      toast.error("Erreur lors du rejet");
      return;
    }

    toast.success("Utilisateur rejeté");
    loadPendingUsers();
    setShowDocumentsDialog(false);
  };

  const handleApproveDocument = async (docId: string) => {
    const { error } = await supabase
      .from("driver_documents")
      .update({ 
        status: "approved",
        verified_at: new Date().toISOString(),
        verified_by: user?.id
      })
      .eq("id", docId);

    if (error) {
      toast.error("Erreur lors de l'approbation du document");
      return;
    }

    toast.success("Document approuvé");
    if (selectedUser) {
      loadUserDocuments(selectedUser.id);
    }
  };

  const handleRejectDocument = async (reason: string) => {
    if (!selectedDocument) return;

    const { error } = await supabase
      .from("driver_documents")
      .update({ 
        status: "rejected",
        rejection_reason: reason,
        verified_at: new Date().toISOString(),
        verified_by: user?.id
      })
      .eq("id", selectedDocument.id);

    if (error) {
      toast.error("Erreur lors du rejet du document");
      return;
    }

    toast.success("Document rejeté");
    if (selectedUser) {
      loadUserDocuments(selectedUser.id);
    }
  };

  const openRejectionDialog = (doc: UserDocument) => {
    setSelectedDocument(doc);
    setShowRejectionDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      drivers_license: "Permis de conduire",
      vehicle_insurance: "Assurance véhicule",
      vehicle_registration: "Carte grise",
      other: "Autre"
    };
    return labels[type] || type;
  };

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Administration" />
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle réservation
          </Button>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle réservation</DialogTitle>
            </DialogHeader>
            <CreateReservationForm onSuccess={() => {
              setShowCreateDialog(false);
              toast.success("Réservation créée ! Elle sera visible sur l'app chauffeur.");
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pending">
            <Users className="h-4 w-4 mr-2" />
            En attente ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approuvés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Inscriptions en attente d'approbation</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune inscription en attente
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {user.full_name?.[0] || user.email[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {user.full_name || "Sans nom"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocuments(user)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Documents
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApproveUser(user.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRejectUser(user.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs approuvés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Fonctionnalité à venir
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Documents de {selectedUser?.full_name || selectedUser?.email}
            </DialogTitle>
          </DialogHeader>

          {userDocuments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun document téléchargé
            </p>
          ) : (
            <div className="space-y-4">
              {userDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          <span className="font-medium">
                            {getDocumentTypeLabel(doc.document_type)}
                          </span>
                          <Badge
                            variant={
                              doc.status === "approved"
                                ? "default"
                                : doc.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {doc.status === "approved"
                              ? "Approuvé"
                              : doc.status === "rejected"
                              ? "Rejeté"
                              : "En attente"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {doc.document_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Téléchargé le{" "}
                          {new Date(doc.uploaded_at).toLocaleDateString("fr-FR")}
                        </p>
                        {doc.rejection_reason && (
                          <p className="text-sm text-destructive">
                            Raison du rejet : {doc.rejection_reason}
                          </p>
                        )}
                      </div>

                      {doc.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveDocument(doc.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openRejectionDialog(doc)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowDocumentsDialog(false)}
            >
              Fermer
            </Button>
            {selectedUser && (
              <>
                <Button
                  variant="default"
                  onClick={() => handleApproveUser(selectedUser.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approuver l'utilisateur
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectUser(selectedUser.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Rejeter l'utilisateur
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DocumentRejectionDialog
        open={showRejectionDialog}
        onOpenChange={setShowRejectionDialog}
        onConfirm={handleRejectDocument}
        documentName={selectedDocument?.document_name || ""}
      />
    </div>
  );
};

export default Admin;
