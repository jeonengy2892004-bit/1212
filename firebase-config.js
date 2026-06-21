/* ============================================
   12:12 CAFE — FIREBASE CONFIGURATION & DATABASE
   Replaces the Claude.ai-only window.storage with real, cloud-hosted
   Firestore storage that works on Netlify, Vercel, or any static host.

   ⚠️ SETUP REQUIRED — do this before going live:

   1. Go to https://console.firebase.google.com and create a free project.
   2. In the project, go to "Build" → "Firestore Database" → "Create database".
      - Choose a region close to your customers (e.g. eur3 / europe-west).
      - Start in PRODUCTION mode, then set the rule below (step 4).
   3. Go to Project Settings (gear icon) → scroll to "Your apps" → click the
      web icon (</>) to register a web app. Copy the firebaseConfig object
      it gives you and paste it into FIREBASE_CONFIG below.
   4. In Firestore → Rules tab, paste this and click Publish:

      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /catalog/overrides {
            allow read: if true;
            allow write: if true;
          }
        }
      }

      NOTE: "allow write: if true" means anyone who finds this collection
      could technically edit it directly (not through your admin password —
      they'd need to know Firestore's API directly, which is unlikely, but
      possible). This is the same tradeoff as the Telegram bot token: low
      risk, acceptable for a first version. For real protection later, add
      Firebase Authentication and restrict writes to logged-in admins.
   ============================================ */

(function(){

  // ====== PASTE YOUR FIREBASE CONFIG HERE ======
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAjwigyaA5usclYTGP9z-EU2Dl09IXUEu4",
    authDomain: "project-977717664601008517.firebaseapp.com",
    projectId: "project-977717664601008517",
    storageBucket: "project-977717664601008517.firebasestorage.app",
    messagingSenderId: "708692328137",
    appId: "1:708692328137:web:10e878d6c849a85de69718"
  };
  // ===============================================

  let dbPromise = null;

  function isConfigured(){
    return FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY' && FIREBASE_CONFIG.projectId !== 'YOUR_PROJECT_ID';
  }

  // Lazy-load the Firebase SDK from CDN only when first needed.
  async function getDb(){
    if(dbPromise) return dbPromise;

    dbPromise = (async () => {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
      const { getFirestore, doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

      const app = initializeApp(FIREBASE_CONFIG);
      const db = getFirestore(app);
      return { db, doc, getDoc, setDoc };
    })();

    return dbPromise;
  }

  const DOC_PATH = ['catalog', 'overrides'];

  async function getOverrides(){
    if(!isConfigured()){
      console.warn('[FirebaseDB] Not configured yet — using empty overrides. See setup instructions in firebase-config.js');
      return {};
    }
    try{
      const { db, doc, getDoc } = await getDb();
      const ref = doc(db, ...DOC_PATH);
      const snap = await getDoc(ref);
      return snap.exists() ? (snap.data().data || {}) : {};
    } catch(e){
      console.error('[FirebaseDB] Failed to read overrides:', e);
      return {};
    }
  }

  async function saveOverrides(overrides){
    if(!isConfigured()){
      console.warn('[FirebaseDB] Not configured yet — change was not saved. See setup instructions in firebase-config.js');
      return false;
    }
    try{
      const { db, doc, setDoc } = await getDb();
      const ref = doc(db, ...DOC_PATH);
      await setDoc(ref, { data: overrides, updatedAt: new Date().toISOString() });
      return true;
    } catch(e){
      console.error('[FirebaseDB] Failed to save overrides:', e);
      return false;
    }
  }

  window.FirebaseDB = { getOverrides, saveOverrides, isConfigured };

})();