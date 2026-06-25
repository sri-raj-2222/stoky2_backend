require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function test() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  // Try to query common table names for discounts/coupons
  const tables = ['discounts', 'coupons', 'promo_codes', 'discount_codes'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    console.log(`Table ${table}:`, error ? `Not found (${error.message})` : `Exists!`);
  }
}

test();
