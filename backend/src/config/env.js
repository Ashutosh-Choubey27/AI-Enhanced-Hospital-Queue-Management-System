const dotenv = require("dotenv");

dotenv.config();

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_hospital_queue",
  jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",
  clientOrigins: (process.env.CLIENT_ORIGINS || "http://localhost:5173")
    .split(",")
    .map(origin => origin.trim()),
  mlServiceUrl: process.env.ML_SERVICE_URL || "http://127.0.0.1:8001",
};

module.exports = { env, requireEnv };