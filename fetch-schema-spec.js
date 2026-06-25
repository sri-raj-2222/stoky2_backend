require('dotenv').config();
const https = require('https');

const url = new URL(process.env.SUPABASE_URL);
const options = {
  hostname: url.hostname,
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const spec = JSON.parse(body);
      
      console.log('Tables defined in DB:');
      console.log(Object.keys(spec.definitions || {}));
      
      if (spec.definitions && spec.definitions.orders) {
        console.log('\n--- Orders Table Columns ---');
        console.log(JSON.stringify(spec.definitions.orders.properties, null, 2));
      }
      
      if (spec.definitions && spec.definitions.order_items) {
        console.log('\n--- Order Items Table Columns ---');
        console.log(JSON.stringify(spec.definitions.order_items.properties, null, 2));
      }
      
      if (spec.definitions && spec.definitions.profiles) {
        console.log('\n--- Profiles Table Columns ---');
        console.log(JSON.stringify(spec.definitions.profiles.properties, null, 2));
      }
    } catch (e) {
      console.error('Failed to parse schema:', e.message);
      console.log('Raw body snippet:', body.slice(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('HTTP Request error:', e);
});

req.end();
