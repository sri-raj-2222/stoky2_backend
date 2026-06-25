require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkOrderItems() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    const { data: items, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', '08e80526-6706-4708-b042-95bc515d695c');
      
    if (error) {
      console.error('Error fetching order items:', error);
      return;
    }
    
    console.log(`Found ${items.length} order items:`);
    console.log(JSON.stringify(items, null, 2));
  } catch (e) {
    console.error('Error:', e);
  }
}

checkOrderItems();
