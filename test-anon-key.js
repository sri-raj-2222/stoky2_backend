require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Load anon credentials from frontend .env.local
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envLocalPath = path.join(__dirname, '../frontend/.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));

async function testAnonKey() {
  const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Initializing client-side Supabase client...');
  console.log('URL:', supabaseUrl);
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) {
      console.error('Error selecting from profiles with Anon Key:', error);
    } else {
      console.log('Profiles returned with Anon Key:', data);
    }
  } catch (e) {
    console.error('Crash:', e);
  }
}

testAnonKey();
