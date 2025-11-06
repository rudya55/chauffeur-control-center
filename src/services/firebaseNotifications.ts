import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/integrations/firebase/config';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const VAPID_KEY = "BOlQMOQTwrvYPlwk5JPHdvx7bxugKve857bclQthPvfQrJwleK9gpstfDmXKhL59C-k5JNV00U9wHdtrT0kMJLk";

export const requestNotificationPermission = async (userId: string) => {
  try {
    if (typeof window === 'undefined') return false;

    if (!('Notification' in window)) {
      toast.error('Votre navigateur ne supporte pas les notifications');
      return false;
    }

    if (!messaging) {
      toast.error('Service de notifications non disponible');
      return false;
    }

    try {
      const res: any = await supabase
        .from('profiles')
        .select('push_notifications_enabled, notification_sound')
        .eq('id', userId)
        .maybeSingle();

      if (res?.error) {
        console.warn('Impossible de lire preferences profil (colonnes peut-etre manquantes):', res.error.message);
      }

      const profile: any = res?.data;
      if (profile && profile.push_notifications_enabled === false) {
        toast.error('Les notifications sont désactivées dans les paramètres de votre compte. Activez-les dans Réglages.');
        window.location.href = '/settings';
        return false;
      }

      if (profile && profile.notification_sound) {
        try { localStorage.setItem('notification-sound', profile.notification_sound); } catch (e) { /* ignore */ }
      }
    } catch (err) {
      console.warn('Impossible de lire les préférences du profil avant la demande de permission', err);
    }

    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      if (perm === 'denied') toast.error('Vous avez refusé les notifications. Activez-les dans les paramètres de votre navigateur.');
      return false;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (!token) {
      toast.error('Erreur lors de l\'activation des notifications');
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ fcm_token: token })
      .eq('id', userId);

    if (error) {
      console.error('Erreur enregistrement token:', error);
      toast.error('Erreur lors de l\'enregistrement du token');
      return false;
    }

    toast.success('Notifications activées avec succès');
    setupForegroundMessageListener();
    return true;
  } catch (e) {
    console.error('Erreur demande permission:', e);
    toast.error('Erreur lors de l\'activation des notifications');
    return false;
  }
};

export const setupForegroundMessageListener = () => {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    const title = payload.notification?.title || 'Nouvelle notification';
    const body = payload.notification?.body || '';
    toast.info(title, { description: body, duration: 5000 });

    if (Notification.permission === 'granted') {
      const n = new Notification(title, { body, icon: '/icon-192x192.png', badge: '/icon-192x192.png', tag: payload.data?.reservationId || 'notification', data: payload.data });
      n.onclick = (ev) => { ev.preventDefault(); window.focus(); if (payload.data?.reservationId) window.location.href = '/reservations'; };
    }

    playNotificationSound();
  });
};

const playNotificationSound = () => {
  try {
    const sound = (typeof window !== 'undefined' && localStorage.getItem('notification-sound')) || 'default';

    const tryPlayFile = async (name: string): Promise<boolean> => {
      if (typeof window === 'undefined') return false;
      const exts = ['mp3', 'ogg'];
      for (const ext of exts) {
        const url = `/sounds/${name}.${ext}`;
        try {
          const audio = new Audio(url);
          audio.preload = 'auto';
          audio.volume = 0.9;
          await audio.play();
          setTimeout(() => { try { audio.pause(); audio.src = ''; } catch (e) {} }, 1200);
          return true;
        } catch (err) {
          // ignore and try next ext
        }
      }
      return false;
    };

    const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AudioCtx) return;

    tryPlayFile(sound).then((played) => {
      if (played) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const playTone = (freq: number, duration = 0.12, type: OscillatorType = 'sine', gain = 0.12) => {
        const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(freq, now); g.gain.setValueAtTime(gain, now); o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + duration);
      };
      if (sound === 'alert1' || sound === 'default') { playTone(900); setTimeout(() => playTone(1100), 160); }
      else if (sound === 'alert2') { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(1200, now); o.frequency.linearRampToValueAtTime(700, now + 0.3); g.gain.setValueAtTime(0.12, now); o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.35); }
      else if (sound === 'chime') { [660,880,990].forEach((f,i)=>{ const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='triangle'; o.frequency.setValueAtTime(f, now + i*0.06); g.gain.setValueAtTime(0.08/(i+1), now + i*0.06); o.connect(g); g.connect(ctx.destination); o.start(now + i*0.06); o.stop(now + i*0.06 + 0.35); }); }
      else { playTone(950, 0.14); }
      setTimeout(()=>{ try{ ctx.close(); }catch(e){} }, 800);
    }).catch((e)=>{ console.log('Erreur lecture son, fallback WebAudio', e); });
  } catch (e) { console.log('Impossible de jouer le son:', e); }
};

export const checkNotificationPermission = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Notification.permission === 'granted';
};

export const getCurrentFCMToken = async (): Promise<string | null> => {
  try {
    if (!messaging) return null;
    if (Notification.permission !== 'granted') return null;
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    return token || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

