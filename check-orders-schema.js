require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkOrdersSchema() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    // 1. Fetch one row from orders
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
      
    if (orderErr) {
      console.error('Error fetching order:', orderErr);
    } else {
      console.log('Orders row structure:', order.length > 0 ? order[0] : 'No orders found');
    }
    
    // 2. Fetch one row from order_items
    const { data: item, error: itemErr } = await supabase
      .from('order_items')
      .select('*')
      .limit(1);
      
    if (itemErr) {
      console.error('Error fetching order item:', itemErr);
    } else {
      console.log('Order items row structure:', item.length > 0 ? item[0] : 'No order items found');
    }
    
    // 3. Try to check profiles linked
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
      
    if (profErr) {
      console.error('Error fetching profile:', profErr);
    } else {
      console.log('Profiles row structure:', profile.length > 0 ? profile[0] : 'No profiles found');
    }
  } catch (e) {
    console.error('Crash:', e);
  }
}

checkOrdersSchema();
