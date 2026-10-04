# A_2_Z_Fashion — Final Setup Checklist

This package contains the COD order flow and server-enforced admin role checks.

## Customer flow
Product → COD checkout → name/mobile/address/city/state/PIN → Place Order → order saved in Firestore.

## Admin flow
Sign in with Firebase Authentication. The account is an admin only when `admins/{UID}` exists with `role: "admin"`. Admin can read/update orders and manage products according to Firestore rules.

## Required Firebase steps before real use
1. Enable Email/Password in Firebase Authentication.
2. Create the admin account.
3. Copy that user's UID into Firestore: `admins/{UID}` with `role: "admin"`.
4. Publish `firestore.rules` from this project.
5. Test with one customer order and one separate admin account.

## Push notification
A real phone push notification requires Firebase Cloud Messaging plus the Android/Web messaging credentials for the chosen deployment. The current package does not claim that push delivery is already live without those project credentials and deployment steps.
