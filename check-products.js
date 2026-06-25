require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkProductsTable() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing credentials in .env");
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  try {
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      console.log("❌ Error querying 'products' table:", error.message, error);
    } else {
      console.log("✅ 'products' table exists!");
      console.log("Row count:", count);
      console.log("Sample data:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Crash:", err);
  }
}

checkProductsTable();
