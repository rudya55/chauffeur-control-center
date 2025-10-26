-- Migration pour ajouter le rôle admin à fasttransport26@gmail.com
-- À exécuter après la création du compte

-- Cette migration ajoute automatiquement le rôle admin à l'utilisateur avec l'email fasttransport26@gmail.com
-- Si le compte n'existe pas encore, vous devez d'abord vous inscrire dans l'application

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Trouver l'ID de l'utilisateur avec l'email fasttransport26@gmail.com
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'fasttransport26@gmail.com'
  LIMIT 1;

  -- Si l'utilisateur existe
  IF admin_user_id IS NOT NULL THEN
    -- Vérifier si le rôle admin existe déjà
    IF NOT EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = admin_user_id AND role = 'admin'
    ) THEN
      -- Ajouter le rôle admin
      INSERT INTO public.user_roles (user_id, role)
      VALUES (admin_user_id, 'admin');
      
      RAISE NOTICE 'Rôle admin ajouté pour fasttransport26@gmail.com';
    ELSE
      RAISE NOTICE 'L''utilisateur fasttransport26@gmail.com a déjà le rôle admin';
    END IF;
  ELSE
    RAISE NOTICE 'Utilisateur fasttransport26@gmail.com non trouvé. Veuillez d''abord créer le compte dans l''application.';
  END IF;
END $$;
