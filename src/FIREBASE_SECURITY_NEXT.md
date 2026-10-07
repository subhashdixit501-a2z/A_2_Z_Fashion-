# A_2_Z_Fashion — Secure Firebase setup

This build changes the app so a signed-in account is NOT automatically an admin.
Admin access is granted only when `admins/{uid}` exists with `role: "admin"`.

## Provision the first admin
Use the Firebase Console to create an `admins` document whose document ID is the admin user's Firebase Auth UID and whose field is:

`role: "admin"`

Do not create admin records from the public app.

## Firestore rules
The included `firestore.rules` protects customer addresses and phone numbers: normal users can create COD orders but cannot read/update/delete orders. Only an authorized admin can read and manage orders and products.

## Notifications
For production push notifications, enable Firebase Cloud Messaging and register the admin device token in a protected collection. A trusted server/Cloud Function should send a notification when a new order document is created. Do not put FCM server credentials in the mobile/web client.
