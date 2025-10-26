# Comment devenir administrateur de l'application VTC Dispatch

## 📋 Étapes pour activer le compte admin

### Méthode 1 : Via le Dashboard Supabase (Recommandé)

1. **Connectez-vous à votre Dashboard Supabase** :
   - Allez sur : https://supabase.com/dashboard
   - Sélectionnez votre projet : `nulrmprnorszvsdenxqa`

2. **Créez d'abord votre compte dans l'application** :
   - Téléchargez et installez l'APK v2.8
   - Cliquez sur "Pas encore de compte ? S'inscrire"
   - Inscrivez-vous avec l'email : **fasttransport26@gmail.com**
   - Vérifiez votre email pour confirmer le compte

3. **Ajoutez le rôle admin dans Supabase** :
   - Dans le Dashboard Supabase, allez dans **"SQL Editor"**
   - Collez ce code SQL :

```sql
-- Trouver votre user_id
SELECT id, email FROM auth.users WHERE email = 'fasttransport26@gmail.com';

-- Ensuite, remplacez 'VOTRE-USER-ID' par l'ID récupéré ci-dessus
INSERT INTO public.user_roles (user_id, role)
VALUES ('VOTRE-USER-ID', 'admin');
```

4. **Vérifiez que le rôle est bien ajouté** :
```sql
SELECT u.email, ur.role
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'fasttransport26@gmail.com';
```

### Méthode 2 : Via la migration SQL

1. **Créez d'abord votre compte** dans l'application (comme ci-dessus)

2. **Appliquez la migration** :
   - Dans le Dashboard Supabase, allez dans **"SQL Editor"**
   - Cliquez sur **"New query"**
   - Copiez le contenu du fichier : `supabase/migrations/20251026_add_admin_role.sql`
   - Exécutez la requête

### Méthode 3 : Manuelle simple (la plus facile)

1. **Créez votre compte** dans l'application avec l'email `fasttransport26@gmail.com`

2. **Dans Supabase Dashboard** :
   - Allez dans **"Table Editor"**
   - Sélectionnez la table **"auth.users"**
   - Trouvez votre utilisateur (fasttransport26@gmail.com)
   - **Copiez votre `id`** (c'est un UUID comme : a1b2c3d4-e5f6-7890-abcd-ef1234567890)

3. **Ajoutez le rôle admin** :
   - Allez dans **"Table Editor"**
   - Sélectionnez la table **"user_roles"**
   - Cliquez sur **"Insert"** → **"Insert row"**
   - Remplissez :
     - `user_id` : Collez votre UUID copié précédemment
     - `role` : Sélectionnez **"admin"**
   - Cliquez sur **"Save"**

4. **Déconnectez-vous et reconnectez-vous** dans l'application

## ✅ Vérification

Une fois le rôle admin ajouté :
- Reconnectez-vous à l'application
- Vous devriez voir un nouveau menu **"Administration"** dans la barre latérale
- Depuis ce menu, vous pourrez :
  - ✅ Valider les documents des chauffeurs
  - 👥 Gérer les utilisateurs
  - ➕ Créer des réservations
  - 📊 Accéder aux statistiques complètes

## 🔐 Informations importantes

- **Email admin** : fasttransport26@gmail.com
- **Projet Supabase** : nulrmprnorszvsdenxqa
- **URL Supabase** : https://nulrmprnorszvsdenxqa.supabase.co

## ⚠️ En cas de problème

Si vous ne voyez pas le menu Administration après avoir ajouté le rôle :
1. Déconnectez-vous complètement de l'application
2. Fermez l'application
3. Rouvrez-la et reconnectez-vous
4. Le menu Administration devrait apparaître

## 📞 Support

Si vous rencontrez des difficultés, vérifiez que :
- ✅ Vous êtes bien inscrit avec l'email fasttransport26@gmail.com
- ✅ Votre compte email est confirmé
- ✅ Le rôle admin est bien présent dans la table user_roles
- ✅ Vous vous êtes déconnecté et reconnecté après l'ajout du rôle
