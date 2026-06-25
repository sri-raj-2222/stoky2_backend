require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  console.log('Starting migration: add role column to profiles...');

  // Step 1: Check if role column exists
  const { error: checkError } = await supabase
    .from('profiles')
    .select('role')
    .limit(1);

  if (checkError) {
    console.warn('Column "role" does not exist yet.');
    console.log('Attempting to add column via exec_sql RPC...');

    const { error: rpcError } = await supabase.rpc('exec_sql', {
      query: "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';"
    });

    if (rpcError) {
      console.error('Could not add column automatically:', rpcError.message);
      console.log('\n--- Manual step required ---');
      console.log('Run this SQL in the Supabase Dashboard SQL Editor:\n');
      console.log("  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';");
      console.log('\nThen re-run this script to set the admin role.');
      return;
    }

    console.log('Column "role" added successfully.');
  } else {
    console.log('Column "role" already exists.');
  }

  // Step 2: Set admin role for the specified email
  const targetEmail = 'garapatisurya07@gmail.com';
  console.log(`Setting role = 'admin' for ${targetEmail}...`);

  const { data, error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('email', targetEmail)
    .select();

  if (updateError) {
    console.error('Failed to update role:', updateError.message);
    return;
  }

  if (!data || data.length === 0) {
    console.warn(`No profile found with email: ${targetEmail}`);
    return;
  }

  console.log('Admin role set successfully:', data[0]);
  console.log('Migration complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
