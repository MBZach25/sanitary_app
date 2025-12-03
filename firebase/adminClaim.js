const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "r1YErhrmg3fShBNDmNAumONm4A03"; // your cleaner/admin UID

admin.auth().setCustomUserClaims(uid, { userRole: "cleaner" })
  .then(() => console.log("Custom claim 'userRole: cleaner' added successfully"))
  .catch((err) => console.error(err));
