import { uploadIssueImage } from ".uploadIssue";
import * as ImagePicker from "expo-image-picker";

const pickImage = async () => {
  let result = await ImagePicker.launchCameraAsync({
    quality: 0.6,
  });

  if (!result.cancelled) {
    await uploadIssueImage(result.assets[0].uri, auth.currentUser.uid, "sink clogged");
    alert("Uploaded!");
  }
};