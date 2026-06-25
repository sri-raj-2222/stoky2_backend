require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function runSql() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const sql = process.argv.slice(2).join(' ');
  if (!sql) {
    console.error('Please provide a SQL query.');
    return;
  }
  
  console.log('Running SQL:', sql);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });
    if (error) {
      console.error('SQL Execution Error:', error);
    } else {
      console.log('SQL Execution Success:', data);
    }
  } catch (e) {
    console.error('Crash:', e);
  }
}

runSql();
