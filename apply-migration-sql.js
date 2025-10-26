#!/usr/bin/env node

// Script pour appliquer la migration FCM directement via l'API REST de Supabase
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Supabase
const SUPABASE_URL = 'https://gxwqvtsxktspfehhoubd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4d3F2dHN4a3RzcGZlaGhvdWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTE0NjMsImV4cCI6MjA3NTA2NzQ2M30.LJxc6uUPDdVn8coqyknZBNbI8_zThqN2wnMNAtWrzEI';

async function applyMigrationViaSQL() {
  console.log('🔄 Application de la migration FCM tokens via SQL API...');
  
  try {
    // Lire le fichier SQL de migration
    const migrationPath = path.join(__dirname, 'supabase/migrations/20251025115511_create_fcm_tokens.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📋 SQL à exécuter:');
    console.log(migrationSQL.substring(0, 200) + '...');
    
    // Utiliser l'API SQL de Supabase (via PostgREST)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ sql: migrationSQL })
    });
    
    if (response.ok) {
      console.log('✅ Migration appliquée avec succès !');
      console.log('🎉 La table fcm_tokens a été créée dans votre base de données Supabase');
    } else {
      const errorText = await response.text();
      console.log('❌ Erreur API:', response.status, errorText);
      
      // Solution alternative: afficher les instructions pour appliquer manuellement
      console.log('\n💡 Solution alternative: Appliquer la migration manuellement');
      console.log('🔗 Allez sur votre Dashboard Supabase:');
      console.log(`   https://supabase.com/dashboard/project/gxwqvtsxktspfehhoubd/sql/new`);
      console.log('\n📋 Copiez-collez ce SQL:');
      console.log('=====================================');
      console.log(migrationSQL);
      console.log('=====================================');
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    
    // Fallback: instructions manuelles
    const migrationPath = path.join(__dirname, 'supabase/migrations/20251025115511_create_fcm_tokens.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('\n💡 Appliquez la migration manuellement:');
    console.log('🔗 Dashboard Supabase > SQL Editor:');
    console.log(`   https://supabase.com/dashboard/project/gxwqvtsxktspfehhoubd/sql/new`);
    console.log('\n📋 SQL à exécuter:');
    console.log('=====================================');
    console.log(migrationSQL);
    console.log('=====================================');
  }
}

applyMigrationViaSQL();