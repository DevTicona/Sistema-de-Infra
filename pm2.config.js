const projectName = 'Sistema-de-Infra'
const repo = 'git@github.com:DevTicona/Sistema-de-Infra.git'
const deployUser = 'agetic'
const serverHost = '192.168.24.44'
const deployPath = `/home/${deployUser}/deploy/${projectName}`
const apiPort = 8911
const webPort = 8910

module.exports = {
  apps: [
    {
      name: `${projectName}-api`,
      script: 'yarn',
      args: `rw serve api --port ${apiPort}`,
      cwd: `${deployPath}/current`,
      env: {
        NODE_ENV: 'production',
        PORT: apiPort,
        // DATABASE_URL: "postgresql://..."
      },
      interpreter: '/bin/bash',
      watch: false,
      autorestart: true,
      time: true
    },
    {
      name: `${projectName}-web`,
      script: 'yarn',
      args: `rw serve web --port ${webPort}`,
      cwd: `${deployPath}/current`,
      env: {
        NODE_ENV: 'production',
        PORT: webPort,
        API_URL: `http://localhost:${apiPort}`
      },
      interpreter: '/bin/bash',
      watch: false,
      autorestart: true,
      time: true
    }
  ],

  deploy: {
    production: {
      user: deployUser,
      host: serverHost,
      ref: 'origin/main',
      repo,
      path: deployPath,
      'pre-deploy-local': `scp .env.production ${deployUser}@${serverHost}:${deployPath}/shared/.env`,
      'post-deploy': `
        ln -sf ${deployPath}/shared/.env ${deployPath}/current/.env &&
        yarn install --production &&
        yarn rw build &&
        yarn rw prisma migrate deploy &&
        pm2 startOrRestart ${deployPath}/source/pm2.config.js --env production &&
        pm2 save
      `,
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}
