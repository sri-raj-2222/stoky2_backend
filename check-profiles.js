require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkProfiles() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }
    
    console.log('Profiles currently in DB:');
    console.log(JSON.stringify(profiles, null, 2));
  } catch (e) {
    console.error('Error:', e);
  }
}

checkProfiles();
