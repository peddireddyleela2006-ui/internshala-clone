import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/firebase";

export const googleSignIn = async () => {
  const result = await signInWithPopup(auth, provider);

  const firebaseUser = result.user;

  try {
    await axios.post(
      "https://internshala-clone-zril.onrender.com/api/user/register",
      {
        name: firebaseUser.displayName || "",
        email: firebaseUser.email,
        phone: "",
        password: "",
        provider: "google",
      }
    );
  } catch (error: any) {
    if (error.response?.data?.message !== "User already exists") {
      throw error;
    }
  }

  return firebaseUser;
};