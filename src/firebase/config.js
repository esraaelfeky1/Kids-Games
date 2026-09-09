import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCZmtJzoejCS5qQlQdvBFnEF01ff9Y4elA",
  authDomain: "kids-games-c77fb.firebaseapp.com",
  projectId: "kids-games-c77fb",
  storageBucket: "kids-games-c77fb.firebasestorage.app",
  messagingSenderId: "192069896377",
  appId: "1:192069896377:web:ed92c04ff75be26cc6f368",
};

const app = initializeApp(firebaseConfig);

import { getFirestore } from "firebase/firestore";

export const db = getFirestore(app);
export default app;