#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Supabase depuis le .env
const supabaseUrl = 'https://gxwqvtsxktspfehhoubd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4d3F2dHN4a3RzcGZlaGhvdWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTE0NjMsImV4cCI6MjA3NTA2NzQ2M30.LJxc6uUPDdVn8coqyknZBNbI8_zThqN2wnMNAtWrzEI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🔄 Application de la migration FCM tokens...');
  
  try {
    // Lire le fichier SQL de migration
    const migrationPath = path.join(__dirname, 'supabase/migrations/20251025115511_create_fcm_tokens.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📋 Contenu de la migration:');
    console.log('=====================================');
    console.log(migrationSQL);
    console.log('=====================================');
    
    // Essayer de créer la table directement
    console.log('\n🔄 Tentative de création de la table fcm_tokens...');
    
    // Créer la table
    const { data: createResult, error: createError } = await supabase
      .from('fcm_tokens')
      .select('*')
      .limit(1);
    
    if (createError && createError.code === 'PGRST116') {
      console.log('❌ La table fcm_tokens n\'existe pas encore.');
      console.log('\n💡 Je vais appliquer la migration via l\'API Edge Function...');
      
      // Utiliser une Edge Function pour exécuter le SQL
      const { data, error } = await supabase.functions.invoke('apply-migration', {
        body: { sql: migrationSQL }
      });
      
      if (error) {
        console.log('❌ Edge Function non disponible. Solution alternative:');
        console.log('\n� Copiez ce SQL dans votre Dashboard Supabase > SQL Editor:');
        console.log('URL: https://supabase.com/dashboard/project/gxwqvtsxktspfehhoubd/sql/new');
        console.log('\n' + migrationSQL);
      } else {
        console.log('✅ Migration appliquée via Edge Function !');
      }
    } else if (createError) {
      console.error('❌ Erreur:', createError);
    } else {
      console.log('✅ La table fcm_tokens existe déjà !');
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    
    // Fallback: afficher le SQL à exécuter manuellement
    const migrationPath = path.join(__dirname, 'supabase/migrations/20251025115511_create_fcm_tokens.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('\n� Solution: Appliquer la migration manuellement');
    console.log('🔗 Allez sur: https://supabase.com/dashboard/project/gxwqvtsxktspfehhoubd/sql/new');
    console.log('\n📋 SQL à copier-coller:');
    console.log('=====================================');
    console.log(migrationSQL);
    console.log('=====================================');
  }
}

applyMigration();