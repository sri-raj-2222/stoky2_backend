require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testQuery() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, subtotal, shipping, discount, total, tracking_number, shipped_at, delivered_at, created_at, updated_at, order_items(id, product_name, product_slug, variant, quantity, unit_price, total_price, image_url)"
    )
    .eq("user_id", "0b7e53c2-933d-40b1-a137-10f58e353892");
    
  if (error) {
    console.error("Query Failed:", error);
  } else {
    console.log("Query Succeeded:", JSON.stringify(data, null, 2));
  }
}

testQuery();
