require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testQuery() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", "0b7e53c2-933d-40b1-a137-10f58e353892");
    
  if (error) {
    console.error("Query Failed:", error);
  } else {
    console.log("Query Succeeded, found records:", data.length);
  }
}

testQuery();
