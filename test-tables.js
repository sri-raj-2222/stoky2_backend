require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function test() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  // Try querying information_schema.tables to see if we have access
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    console.log("Products table check:", { hasData: !!data, error });
  } catch (e) {
    console.error("Test error:", e);
  }
}
test();
