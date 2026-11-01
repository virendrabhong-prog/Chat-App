CHAT APP — ONLINE COMMUNITY STARTER

FEATURES IN THIS BUILD
- Email + password sign up and log in, with email verification.
- Password reset email.
- Passkey registration and passkey sign-in using WebAuthn (requires the included Cloud Function).
- Shared servers and channels, with server images and emojis.
- Invite links that expire after 7 days; invitees join the selected server.
- Real-time messages and channel polls; each signed-in member can vote once.
- Responsive layout for desktop and mobile.
- Profile GIFs (5 seconds maximum), frames and effects.

IMPORTANT
This is a starter project, not a live hosted service. You must connect your own Firebase project, deploy the passkey Cloud Function, publish Firestore rules and host the web folder before people can use it. Do not put passwords, service-account keys, or private keys in this folder or share them in chat.

1) CREATE FIREBASE PROJECT
1. Open https://console.firebase.google.com/ and create a Firebase project.
2. Add a Web App in Project settings.
3. Copy the Firebase web config into firebase-config.js, replacing all YOUR_... values.
4. In Firebase Authentication > Sign-in method, enable Email/Password.
5. In Authentication > Settings > Authorized domains, add your website hostname.
6. Create a Cloud Firestore database.
7. Publish the included firestore.rules in Firestore > Rules. The included firestore.indexes.json defines the real-time chat/poll indexes.
8. In Authentication > Templates, customize the email verification and password reset emails if desired.

2) DEPLOY PASSKEY BACKEND
Passkeys need a trusted server to create and verify cryptographic challenges. The browser-only website cannot securely implement passkeys by itself. This project includes a Firebase Cloud Function using @simplewebauthn/server.

1. Install Node.js 20 and the Firebase CLI on your computer.
2. In a terminal, open this chat-app folder and run: firebase init functions
   Choose JavaScript, Node 20, and use the existing functions folder if prompted. If asked to overwrite files, keep the included functions/index.js and functions/package.json.
3. In Firebase Console > Project settings, note your Project ID. In the functions folder, copy .env.example to .env.YOUR_PROJECT_ID.
4. Set PASSKEY_RP_ID to your hosted website hostname only (for example, chat.example.com; no https:// or path).
5. Set PASSKEY_ORIGIN to the exact website origin (for example, https://chat.example.com; no trailing slash). Set PASSKEY_RP_NAME to Chat App.
6. From the functions folder run: npm install
7. From the project root run: firebase deploy --only functions,firestore:rules,firestore:indexes
   Cloud Functions deployment may require the Firebase project to use the Blaze billing plan.
8. Copy the deployed HTTPS function URL into PASSKEY_API_BASE in firebase-config.js. It normally looks like https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/passkeys.
9. Re-upload/redeploy the website after changing firebase-config.js.
10. Sign up and verify your email, then log in and choose + Passkey. Later, enter your email and choose Sign in with passkey.

Passkeys require HTTPS (except localhost) and a supported browser/device. The passkey is unlocked by the device's built-in screen-lock method, such as biometrics or PIN. The server stores only the public credential key, not the device's biometric data.

3) HOST THE WEBSITE
Host the contents of the chat-app folder on an HTTPS static host. Upload index.html, firebase-config.js, passkeys.js, manifest.json and sw.js. Keep the functions folder for deployment; it does not need to be served as static files. Add the final website hostname to Firebase Authentication's authorized domains.

4) TRY IT WITH OTHER PEOPLE
- Every person creates their own account with their email and verifies it.
- A person creates a server and uses Invite to make a link.
- Send the invite link to the people you want to join. It expires after 7 days.
- Members can see and use that server's channels, send messages and create/vote in polls.

FIRESTORE RULES / SECURITY NOTES
- The included rules require verified email accounts for chat access.
- Server directory names are visible to signed-in users; messages and polls are restricted to server members.
- Invite links grant membership to the server until the invite expires.
- This is still a learning prototype. It does not yet include full moderation, spam controls, admin role management, server deletion, file uploads, private DMs, or a production-grade abuse/reporting workflow. Do not use it for sensitive or private information. Review and test security rules before inviting people publicly.
- Passkey Cloud Function endpoints should be protected further with production rate limits, monitoring, and automated cleanup for expired challenge documents before public launch.

PROFILE IMAGE NOTE
Animated GIF profile pictures are limited by the browser-side duration check to 5 seconds or shorter. Images are stored locally in this prototype's profile settings and are not yet synced between devices.

If Firebase is not configured, the app shows a setup message and account creation will not work. This version intentionally requires an email account rather than anonymous guest access.
