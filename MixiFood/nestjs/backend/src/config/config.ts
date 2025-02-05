export const config = () => ({
  port: process.env.PORT,
  server: process.env.SERVER,
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI,
  jwtExpration: process.env.JWT_EXPIRATION,
  twilio_SID: process.env.TWILIO_SID,
  twilio_Token: process.env.TWILIO_TOKEN,
  twilio_PhoneNumber: process.env.TWILIO_PHONENUMBER,
  // s3
  s3BucketName: process.env.BUCKET_NAME,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.REGION,
  // removebg
  removeBgKey: process.env.REMOVEBG_AI_KEY,
  // firebase
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  // map
  mapboxAccessKey: process.env.MAPBOXACCESSKEY,
  // vnpay
  vnpTMNCode: process.env.VNP_TMNCODE,
  vnpHashSecret: process.env.VNP_HASHSECRET,
  vnpUri: process.env.VNP_URI,
  vnpApi: process.env.VNP_API,
  vnpReturnUrl: process.env.VNP_RETURNURL,
  vnpTz: process.env.VNP_TZ,
});
