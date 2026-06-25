require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function test() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log("Checking addresses table...");
  const { data: addr, error: addrErr } = await supabase
    .from('addresses')
    .select('*')
    .limit(1);
  console.log("Addresses table check:", { hasData: !!addr, error: addrErr });

  console.log("Checking orders table...");
  const { data: ord, error: ordErr } = await supabase
    .from('orders')
    .select('*')
    .limit(1);
  console.log("Orders table check:", { hasData: !!ord, error: ordErr });

  console.log("Checking order_items table...");
  const { data: items, error: itemsErr } = await supabase
    .from('order_items')
    .select('*')
    .limit(1);
  console.log("Order items table check:", { hasData: !!items, error: itemsErr });
}

test();
