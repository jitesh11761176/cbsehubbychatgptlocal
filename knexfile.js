
// It's recommended to use environment variables for sensitive data
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'cbse_hub_dev',
      user:     'user',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL, // e.g., postgres://user:password@host:port/database
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
