export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 4000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development',
  },
  database: {
    connectionString: process.env.DB_CONNECTION_STRING,
    name: process.env.DB_NAME || 'foni',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 27017,
  },
  security: {
    encryptionSecretKey: process.env.ENCRYPTION_KEY,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '10h',
  },
  cors: {
    origin: process.env.CORS_ORIGINS || '*',
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  vapi:{
    VAPI_TOKEN: process.env.VAPI_TOKEN,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    VAPI_INBOUND_CALLBACK: process.env.VAPI_INBOUND_CALLBACK,
    VAPI_OUTBOUND_CALLBACK: process.env.VAPI_OUTBOUND_CALLBACK,
  },
  swagger: {
    title: 'Foni API',
    description: 'The Foni API documentation',
    version: '1.0',
    path: 'api/docs',
  }
});
