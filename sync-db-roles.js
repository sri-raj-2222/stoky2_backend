require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function syncDbRoles() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    console.log('Fetching users from Supabase Auth...');
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('Error listing auth users:', authError);
      return;
    }
    
    console.log(`Found ${users.length} auth users.`);
    
    for (const authUser of users) {
      const email = authUser.email;
      const uid = authUser.id;
      const fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User';
      const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null;
      
      // Determine role based on email
      const role = email === 'garapatisurya07@gmail.com' ? 'admin' : 'user';
      
      console.log(`Syncing profile for ${email} (UID: ${uid}) -> Role: ${role}, Full Name: ${fullName}...`);
      
      // Check if profile exists
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();
        
      if (fetchError) {
        console.error(`Error checking profile for ${email}:`, fetchError.message);
        continue;
      }
      
      if (!profile) {
        // Insert new profile
        console.log(`Profile does not exist. Inserting new profile...`);
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: uid,
            email: email,
            full_name: fullName,
            avatar_url: avatarUrl,
            role: role
          })
          .select();
          
        if (insertError) {
          console.error(`Error inserting profile for ${email}:`, insertError.message);
        } else {
          console.log(`Successfully created profile for ${email} with role ${role}.`);
        }
      } else {
        // Update existing profile
        console.log(`Profile exists. Updating profile...`);
        const { data: updated, error: updateError } = await supabase
          .from('profiles')
          .update({
            email: email,
            full_name: fullName,
            avatar_url: avatarUrl,
            role: role
          })
          .eq('id', uid)
          .select();
          
        if (updateError) {
          console.error(`Error updating profile for ${email}:`, updateError.message);
        } else {
          console.log(`Successfully updated profile for ${email} to role ${role}.`);
        }
      }
    }
    
    console.log('Database roles synchronization completed.');
  } catch (e) {
    console.error('Crash in syncDbRoles:', e);
  }
}

syncDbRoles();
