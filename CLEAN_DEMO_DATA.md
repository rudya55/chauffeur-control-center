# 🧹 Nettoyer les données de démonstration

## Vous voyez encore des données de démo ?

C'est normal, la base de données contient encore des données de test. Voici comment les supprimer :

## ✅ Solution rapide (2 minutes)

### Méthode 1 : Via le Dashboard Supabase (Recommandé)

1. **Connectez-vous à Supabase** :
   - https://supabase.com/dashboard
   - Sélectionnez votre projet : **nulrmprnorszvsdsenxq**

2. **Ouvrez SQL Editor** :
   - Dans le menu de gauche, cliquez sur **"SQL Editor"**
   - Cliquez sur **"New query"**

3. **Copiez et exécutez ce code SQL** :

```sql
-- Nettoyer toutes les données de démonstration
DELETE FROM public.reservations;
DELETE FROM public.accounting_transactions;
DELETE FROM public.geographic_zones;
DELETE FROM public.pricing_rules;
DELETE FROM public.airport_packages;
DELETE FROM public.driver_documents;
DELETE FROM public.fcm_tokens;

-- Vos comptes utilisateurs et rôles sont conservés
```

4. **Cliquez sur "RUN"** (ou appuyez sur Ctrl+Enter)

5. ✅ **C'est fait !** Toutes les données de démo sont supprimées

### Méthode 2 : Nettoyer table par table

Si vous préférez voir ce que vous supprimez :

1. Dans le Dashboard Supabase, allez dans **"Table Editor"**

2. Pour chaque table, cliquez dessus et supprimez les lignes :
   - **reservations** → Supprimez toutes les réservations de test
   - **accounting_transactions** → Supprimez toutes les transactions de test
   - **geographic_zones** → Supprimez les zones de test
   - **pricing_rules** → Supprimez les règles de tarification de test
   - **airport_packages** → Supprimez les forfaits de test
   - **fcm_tokens** → Supprimez (seront recréés automatiquement)

3. **NE PAS TOUCHER** à ces tables :
   - ❌ **profiles** → Vos utilisateurs
   - ❌ **user_roles** → Vos rôles admin/chauffeur

## 🔄 Après le nettoyage

1. Fermez l'application sur votre téléphone
2. Rouvrez l'application
3. ✅ Plus de données de démo dans les notifications !

## 📊 Tables à conserver

Ces tables contiennent vos vraies données :
- ✅ **profiles** → Votre compte utilisateur
- ✅ **user_roles** → Votre rôle admin
- ✅ **auth.users** → Votre authentification

## 💡 Remarque

Les tokens FCM (notifications) seront automatiquement recréés la prochaine fois que vous ouvrirez l'application.

## ⚠️ Besoin d'aide ?

Si vous n'êtes pas à l'aise avec SQL, dites-le moi et je peux :
1. Créer un script automatique
2. Le faire pour vous si vous me donnez accès temporaire
3. Créer un bouton "Nettoyer la démo" dans l'application

**Que préférez-vous ?**
