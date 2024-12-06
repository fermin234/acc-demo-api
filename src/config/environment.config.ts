export const environmentConfig = () => ({
  server: {
    port: Number(process.env.PORT),
    baseUrl: process.env.BASE_APP_URL,
  },
  cognito: {
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.COGNITO_CLIENT_ID,
    issuer: process.env.COGNITO_ISSUER,
    endpoint: process.env.COGNITO_ENDPOINT,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
aws: {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
},
sns: {
  topicArn: process.env.SNS_ARN_TOPIC,
},
sqs: {
  endpoint: process.env.SQS_ENDPOINT,
  queue: {
    name: process.env.SQS_QUEUE_NAME,
    url: process.env.SQS_QUEUE_URL,
  }
},
ses: {
  identityEmail: process.env.SES_IDENTITY_EMAIL,
},
s3: {
  bucket: process.env.S3_BUCKET,
},
});
