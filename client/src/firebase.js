// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBsEThGx3sz3-kfWbjSY3l0nSzg_JTO2Ps",
//   authDomain: "imageupload-a6efc.firebaseapp.com",
//   projectId: "imageupload-a6efc",
//   storageBucket: "imageupload-a6efc.appspot.com",
//   messagingSenderId: "214007906498",
//   appId: "1:214007906498:web:0803ce76c5136276367b5b"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const imgDb=getStorage(app) 

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAIonzsF0XLYLZ9hQggUjRbfV-I30UlaYQ",
  authDomain: "uploadimage-9bd72.firebaseapp.com",
  projectId: "uploadimage-9bd72",
  storageBucket: "uploadimage-9bd72.appspot.com",
  messagingSenderId: "379877412584",
  appId: "1:379877412584:web:4c754dfc04eb89b8dc035d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imgDb=getStorage(app) 
