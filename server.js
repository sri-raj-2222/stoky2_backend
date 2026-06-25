require('dotenv').config();

const app = require('./app');
const PORT = process.env.PORT || 5000;

// Config checks are done inside config/supabase.js, but let's import it to initialize
require('./config/supabase');

app.listen(PORT, () => {
  console.log(`STOKY2 API server running on http://localhost:${PORT}`);
});
