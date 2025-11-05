import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, Send, Users, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { requestNotificationPermission, checkNotificationPermission, getCurrentFCMToken } from '@/services/firebaseNotifications';

export default function NotificationTest() {
  const { user } = useAuth();
  const [reservationId, setReservationId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [title, setTitle] = useState('🚗 Nouvelle course disponible');
  const [body, setBody] = useState('Une nouvelle réservation vous attend');
  const [loading, setLoading] = useState(false);
  const [myToken, setMyToken] = useState<string | null>(null);
  const [notifEnabled, setNotifEnabled] = useState(false);

  useState(() => {
    // Vérifier l'état des notifications
    setNotifEnabled(checkNotificationPermission());
    
    // Récupérer le token actuel
    getCurrentFCMToken().then(token => {
      setMyToken(token);
      console.log('Mon token FCM:', token);
    });
  });

  const handleEnableNotifications = async () => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    const success = await requestNotificationPermission(user.id);
    if (success) {
      setNotifEnabled(true);
      const token = await getCurrentFCMToken();
      setMyToken(token);
      toast.success('Notifications activées !');
    }
  };

  const handleSendToDriver = async () => {
    if (!reservationId || !driverId) {
      toast.error('Veuillez renseigner l\'ID de la réservation et du chauffeur');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('notify-new-reservation', {
        body: {
          reservationId,
          driverId,
          title,
          body,
        }
      });

      if (error) throw error;

      console.log('✅ Notification envoyée:', data);
      toast.success(`Notification envoyée à ${data.driver || 'le chauffeur'}`);
    } catch (error: any) {
      console.error('❌ Erreur envoi notification:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToAll = async () => {
    if (!reservationId) {
      toast.error('Veuillez renseigner l\'ID de la réservation');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('notify-new-reservation', {
        body: {
          reservationId,
          title,
          body,
        }
      });

      if (error) throw error;

      console.log('✅ Notifications envoyées:', data);
      toast.success(`${data.sent}/${data.total} notifications envoyées`);
    } catch (error: any) {
      console.error('❌ Erreur envoi notifications:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const handleTestMyself = async () => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (!notifEnabled) {
      toast.error('Activez d\'abord les notifications');
      return;
    }

    // Créer une fausse réservation de test
    setLoading(true);
    try {
      const { data: testReservation, error: resError } = await supabase
        .from('reservations')
        .insert({
          client_name: 'Test Client',
          phone: '0600000000',
          pickup_address: '123 Rue de Test',
          destination: '456 Avenue de Demo',
          date: new Date().toISOString(),
          passengers: 2,
          luggage: 1,
          vehicle_type: 'berline',
          payment_type: 'card',
          amount: 50,
          driver_amount: 40,
          commission: 10,
          dispatcher: 'Test Admin',
          status: 'pending',
        })
        .select()
        .single();

      if (resError) throw resError;

      console.log('Réservation test créée:', testReservation.id);

      // Envoyer la notification à soi-même
      const { data, error } = await supabase.functions.invoke('notify-new-reservation', {
        body: {
          reservationId: testReservation.id,
          driverId: user.id,
          title: '🧪 Test de notification',
          body: 'Ceci est un test. Si vous voyez cela, ça fonctionne !',
        }
      });

      if (error) throw error;

      console.log('✅ Notification test envoyée:', data);
      toast.success('Notification de test envoyée !');

      // Supprimer la réservation test après 5 secondes
      setTimeout(async () => {
        await supabase.from('reservations').delete().eq('id', testReservation.id);
        console.log('Réservation test supprimée');
      }, 5000);
    } catch (error: any) {
      console.error('❌ Erreur test:', error);
      toast.error(error.message || 'Erreur lors du test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Test de Notifications Push</h1>
          <p className="text-muted-foreground">
            Testez l'envoi de notifications Firebase Cloud Messaging
          </p>
        </div>
      </div>

      {/* Statut des notifications */}
      <Card>
        <CardHeader>
          <CardTitle>État de mes notifications</CardTitle>
          <CardDescription>
            Vérifiez que vos notifications sont activées avant de tester
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${notifEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium">
              {notifEnabled ? 'Notifications activées ✅' : 'Notifications désactivées ❌'}
            </span>
          </div>

          {!notifEnabled && (
            <Button onClick={handleEnableNotifications} className="w-full">
              <Bell className="mr-2 h-4 w-4" />
              Activer les notifications
            </Button>
          )}

          {myToken && (
            <div className="space-y-2">
              <Label>Mon token FCM</Label>
              <Textarea 
                value={myToken} 
                readOnly 
                className="font-mono text-xs h-20"
              />
            </div>
          )}

          <Button 
            onClick={handleTestMyself} 
            disabled={!notifEnabled || loading}
            className="w-full"
            variant="secondary"
          >
            <Send className="mr-2 h-4 w-4" />
            M'envoyer une notification de test
          </Button>
        </CardContent>
      </Card>

      {/* Envoyer à un chauffeur spécifique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Envoyer à un chauffeur spécifique
          </CardTitle>
          <CardDescription>
            Envoyez une notification à un chauffeur en particulier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reservationId">ID de la réservation</Label>
            <Input
              id="reservationId"
              placeholder="UUID de la réservation"
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driverId">ID du chauffeur</Label>
            <Input
              id="driverId"
              placeholder="UUID du chauffeur (user_id)"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre de la notification</Label>
            <Input
              id="title"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Corps de la notification"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleSendToDriver} 
            disabled={loading || !reservationId || !driverId}
            className="w-full"
          >
            <Send className="mr-2 h-4 w-4" />
            Envoyer au chauffeur
          </Button>
        </CardContent>
      </Card>

      {/* Envoyer à tous les chauffeurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Envoyer à tous les chauffeurs
          </CardTitle>
          <CardDescription>
            Diffusez une notification à tous les chauffeurs ayant activé les notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reservationIdAll">ID de la réservation</Label>
            <Input
              id="reservationIdAll"
              placeholder="UUID de la réservation"
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSendToAll} 
            disabled={loading || !reservationId}
            className="w-full"
            variant="destructive"
          >
            <Users className="mr-2 h-4 w-4" />
            Envoyer à tous les chauffeurs
          </Button>
        </CardContent>
      </Card>

      {/* Aide */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">💡 Comment tester ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p><strong>1. Activer les notifications :</strong> Cliquez sur "Activer les notifications" et acceptez dans votre navigateur</p>
          <p><strong>2. Test rapide :</strong> Cliquez sur "M'envoyer une notification de test" pour vérifier que tout fonctionne</p>
          <p><strong>3. Test réel :</strong> Créez une vraie réservation depuis la page Réservations, récupérez son ID</p>
          <p><strong>4. Récupérer l'ID chauffeur :</strong> Allez dans Cloud → Database → profiles, copiez l'ID (colonne `id`)</p>
          <p><strong>5. Envoyer :</strong> Remplissez les champs et cliquez sur "Envoyer"</p>
        </CardContent>
      </Card>
    </div>
  );
}
