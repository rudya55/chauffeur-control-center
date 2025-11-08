# Purger l'historique Git si des secrets ont été exposés

Si des clés ou fichiers sensibles (ex: `google-services.json`, `.env`) ont été committés, suivez ces étapes pour
les retirer de l'historique, puis rotat/renouvelez les secrets.

1) Sauvegarde
   - Faites une copie complète du dépôt (tar/zip) avant toute réécriture d'historique.

2) Préparer la liste des fichiers/secrets à supprimer
   - Exemple : `android/app/google-services.json`, `.env`, `android/app/src/main/res/raw/*.mp3`

3) Utiliser `git filter-repo` (recommandé) ou BFG
   - Installer git-filter-repo : https://github.com/newren/git-filter-repo
   - Commande exemple :

```bash
# supprimer un fichier de tout l'historique
git clone --mirror git@github.com:your-org/your-repo.git repo-mirror.git
cd repo-mirror.git
git filter-repo --path android/app/google-services.json --invert-paths
# répéter pour d'autres chemins ou écrire un fichier de règles
git push --force
```

4) Si vous utilisez BFG (alternative)

```bash
git clone --mirror git@github.com:your-org/your-repo.git
java -jar bfg.jar --delete-files google-services.json repo.git
cd repo.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

5) Rotation des clés
   - Après purge, considérez la clé comme compromise et régénérez-la immédiatement.
   - Pour Supabase/Firebase : créez de nouvelles clés et remplacez les anciennes sur les services.

6) Informez les collaborateurs
   - Tous les contributeurs devront recloner le dépôt (`git clone`) après la réécriture.

7) Prévenir à l'avenir
   - Configurez `.gitignore` pour éviter de commit des fichiers secrets.
   - Utilisez CI secrets pour injecter des fichiers natifs (`google-services.json`) et variables d'environnement lors des builds.

Si tu veux, je peux générer automatiquement la commande `git filter-repo` adaptée à la liste des fichiers qui ont été trouvés dans l'audit précédemment.
