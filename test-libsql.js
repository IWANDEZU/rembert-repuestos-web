const { createClient } = require('@libsql/client');
const client = createClient({ url: 'file:./dev.db' });
client.execute('SELECT 1').then(console.log).catch(console.error);
