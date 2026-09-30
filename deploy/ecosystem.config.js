// ==============================================================================
// CONFIGURATION PM2 (HOSTINGER VPS & CLOUD HOSTING)
// ==============================================================================

module.exports = {
  apps: [
    {
      name: 'radene-kevin-wedding',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
};
