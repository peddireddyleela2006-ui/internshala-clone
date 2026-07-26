import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/firebase";

const API = "https://internshala-clone-zril.onrender.com/api";

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
        firebaseUid: firebaseUser.uid,
        photo: firebaseUser.photoURL || "",
      }
    );
  } catch (error: any) {

    console.log("GOOGLE REGISTER ERROR:", error.response?.data);

    if (error.response?.data?.message !== "User already exists") {
      throw error;
    }
  }

  // Fetch MongoDB user
  const res = await axios.get(
    `${API}/user/email/${firebaseUser.email}`
  );
  await axios.post(
    `${API}/loginhistory/save`,
    {
      email: firebaseUser.email,
    }
  );
  return {
    firebaseUser,
    mongoUser: res.data.user,
  };
};