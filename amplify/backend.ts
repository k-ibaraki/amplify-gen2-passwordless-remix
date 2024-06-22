import { Stack } from "aws-cdk-lib/core"
import * as cdk from 'aws-cdk-lib';
import { Passwordless } from "amazon-cognito-passwordless-auth/cdk";
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import 'dotenv/config'

// 環境変数を取得
const AUTH_FRONTEND_URL = process.env.AUTH_FRONTEND_URL ?? "";
const AUTH_FRONTEND_HOST = process.env.AUTH_FRONTEND_HOST ?? "";
const AUTH_EMAIL_FROM_ADDRESS = process.env.AUTH_EMAIL_FROM_ADDRESS ?? "";
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL ?? "";

// Amplifyのバックエンドを定義
const backend = defineBackend({
  auth,
});

// ユーザープールとクライアントを取得
const userPool = backend.auth.resources.userPool as cdk.aws_cognito.UserPool;
const userPoolClient = backend.auth.resources.userPoolClient as cdk.aws_cognito.UserPoolClient;
// AuthのCDK Stackを取得
const authStack = Stack.of(userPool);

// Amplifyが作ったuserpoolにパスワードレス認証フローを追加
const passwordless = new Passwordless(authStack, "Passwordless", {
  userPool,
  userPoolClients: [userPoolClient],
  allowedOrigins: [
    AUTH_FRONTEND_URL!
  ],
  fido2: {
    allowedRelyingPartyIds: [
      AUTH_FRONTEND_HOST!
    ],
  },
  magicLink: {
    sesFromAddress: AUTH_EMAIL_FROM_ADDRESS!,
  },
});

const user = new cdk.aws_cognito.CfnUserPoolUser(authStack, "TestUser", {
  userPoolId: passwordless.userPool.userPoolId,
  username: TEST_USER_EMAIL,
  messageAction: "SUPPRESS",
  userAttributes: [
    {
      name: "email",
      value: process.env.TEST_USER_EMAIL!,
    },
    {
      name: "email_verified",
      value: "true",
    },
  ],
});
user.node.addDependency(userPool.node.findChild("PreSignUpCognito"));

// configurationファイルにFIDO2のURLを出力
backend.addOutput({
  custom: {
    fido2ApiUrl: passwordless.fido2Api?.url ?? "",
  },
});