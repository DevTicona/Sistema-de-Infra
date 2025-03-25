const projectName = 'Sistema-de-Infra'
const repo = 'git@github.com:DevTicona/Sistema-de-Infra.git'
const deployUser = 'agetic' // Usuario de tu servidor
const serverHost = '192.168.24.44' // IP o dominio
const apiPort = 8911

module.exports = {
  apps: [
    {
      name: `${projectName}-api`,
      script: 'yarn',
      args: 'rw serve api',
      cwd: `./current/api`,
      env: {
        NODE_ENV: 'production',
        //DATABASE_URL="postgresql://app_usr_infra:ZK2o6W81D6bWzYdcC5W7@192.168.24.21:5432/infra_manage?schema=registro"  
    },
      interpreter: '/bin/bash'
    },
    {
      name: `${projectName}-web`,
      script: 'yarn',
      args: 'rw serve web',
      cwd: `./current/web`,
      env: {
        NODE_ENV: 'production'
      },
      interpreter: '/bin/bash'
    }
  ],

  deploy: {
    production: {
      user: deployUser,
      host: serverHost,
      ref: 'origin/main',
      repo,
      path: "/home/agetic/prueba7/Sistema-de-Infra",     
      'post-deploy': `
        yarn install &&
        yarn rw build &&
        yarn rw prisma migrate deploy &&
        pm2 reload pm2.config.js --env production &&
        pm2 save
      `
    }
  }
}
