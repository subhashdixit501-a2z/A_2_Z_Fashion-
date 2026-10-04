# A_2_Z_Fashion — Android APK build

This project is prepared for Capacitor Android packaging.

## On a computer with Node.js + Android Studio

```bash
npm install
npm run android:init
npm run android:sync
npm run android:open
```

Then in Android Studio choose **Build > Build APK(s)**.

For a debug APK from the command line on Windows:

```bash
npm run android:build
```

The debug APK will be under `android/app/build/outputs/apk/debug/`.

## Important

Firebase configuration is already included in the project. Before production release, verify Firestore rules, Authentication, Storage rules, app signing, privacy policy, and any payment/shipping integrations.
