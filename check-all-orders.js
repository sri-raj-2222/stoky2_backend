require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkAllOrders() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, user_id, shipping_address, created_at');
      
    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }
    
    console.log(`Found ${orders.length} orders:`);
    console.log(JSON.stringify(orders, null, 2));
  } catch (e) {
    console.error('Error:', e);
  }
}

checkAllOrders();
