const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

let serviceAccount;

if (process.env.FIREBASE_PROJECT_ID) {
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
} else {
  serviceAccount = require("./firebaseAdmin.json");
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

module.exports = {
  auth: getAuth(),
};