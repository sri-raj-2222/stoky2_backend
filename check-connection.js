require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function runDiagnostics() {
  console.log("=== STOKY2 Supabase Diagnostic Utility ===");
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file.");
    process.exit(1);
  }

  console.log(`Checking connection to: ${supabaseUrl}`);
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  const tables = ['profiles', 'wishlist', 'orders', 'addresses', 'loyalty_points'];
  
  for (const table of tables) {
    console.log(`\nChecking table: "${table}"...`);
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .limit(1);
        
      if (error) {
        console.error(`❌ Error querying "${table}":`, error.message, `(Code: ${error.code})`);
      } else {
        console.log(`✅ Table "${table}" exists. Row count: ${count ?? 0}`);
      }
    } catch (err) {
      console.error(`💥 Unexpected crash querying "${table}":`, err.message || err);
    }
  }

  console.log("\nDiagnostics finished.");
}

runDiagnostics();
