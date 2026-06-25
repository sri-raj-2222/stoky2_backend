require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkAdminUser() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error("Error listing users:", error);
      return;
    }
    const admin = users.find(u => u.email === 'garapatisurya07@gmail.com');
    if (admin) {
      console.log("✅ Admin user exists in Supabase Auth:");
      console.log(JSON.stringify(admin, null, 2));
    } else {
      console.log("❌ Admin user does NOT exist in Supabase Auth.");
    }
  } catch (e) {
    console.error("Crash:", e);
  }
}
checkAdminUser();
