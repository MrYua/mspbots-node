module.exports = {
  apps: [
    {
      name: 'nmspbot-node', 
      script: './dist/main.js',
      cwd: './',
      args: '', 
      watch: true, 
      ignore_watch: ['node_modules', 'public', 'logs'], 
      instances: '1',
      autorestart: true, 
      max_memory_restart: '1G',
      error_file: './logs/app-err.log', 
      out_file: './logs/app-out.log', 
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      min_uptime: '60s',
      max_restarts: 30, 
      restart_delay: 60,
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      env_test: {
        NODE_ENV: 'test',
      },
    },
  ],


};
