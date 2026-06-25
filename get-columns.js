require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function getColumns() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  try {
    // Run raw SQL via RPC or check if we can query postgres catalog or fetch a single row keys
    // Let's first check if there are other columns by doing a select * and printing keys of the first row
    const { data: selectAll, error: errAll } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (errAll) {
      console.error("Select * error:", errAll);
    } else {
      console.log("Keys of products row:", selectAll.length > 0 ? Object.keys(selectAll[0]) : "No rows");
    }

    // Let's also check if there is an error when we query columns that might not exist or if we can see the full table details.
    // We can run an RPC if defined, but usually we don't have it. We can query the API to get table headers or similar.
    // Let's just print a list of other tables if any.
  } catch (err) {
    console.error(err);
  }
}

getColumns();
