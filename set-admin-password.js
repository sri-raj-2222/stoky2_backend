require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function setAdminPassword() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const adminEmail = 'garapatisurya07@gmail.com';
  const newPassword = '12345678';
  
  try {
    console.log(`Searching for user with email: ${adminEmail}...`);
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError);
      return;
    }
    
    const adminUser = users.find(u => u.email === adminEmail);
    
    if (!adminUser) {
      console.log(`User ${adminEmail} not found. Creating user...`);
      const { data: createUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: newPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Admin Surya' }
      });
      
      if (createError) {
        console.error("Error creating admin user:", createError);
      } else {
        console.log("✅ Admin user created successfully:", createUser.user.id);
      }
      return;
    }
    
    console.log(`User found. Updating password for ID: ${adminUser.id}...`);
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { 
        password: newPassword,
        email_confirm: true // ensure email is confirmed
      }
    );
    
    if (updateError) {
      console.error("Error updating user password:", updateError);
    } else {
      console.log("✅ Admin user password updated successfully to '12345678'!");
      console.log("User details:", JSON.stringify(updatedUser.user, null, 2));
    }
  } catch (e) {
    console.error("Crash:", e);
  }
}

setAdminPassword();
