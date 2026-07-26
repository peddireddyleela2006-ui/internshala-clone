import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store/store";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { login, logout } from "@/Feature/Userslice";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@/i18n";
export default function App({ Component, pageProps }: AppProps) {
  function AuthListener() {
    const dispatch = useDispatch();
    useEffect(() => {
      auth.onAuthStateChanged((authuser) => {
        if (authuser) {
          const fetchMongoUser = async () => {
            try {
              const res = await fetch(
                `https://internshala-clone-zril.onrender.com/api/user/email/${authuser.email}`
              );

              const data = await res.json();

              dispatch(
                login({
                  _id: data.user._id,
                  uid: authuser.uid,
                  photo: authuser.photoURL,
                  name: data.user.name,
                  email: data.user.email,
                  phoneNumber: data.user.phone,
                })
              );

            } catch (error) {
              console.log(error);
            }
          };

          fetchMongoUser();
        } else {
          dispatch(logout());
        }
      });
    }, [dispatch]);
    return null;
  }

  return (
    <Provider store={store}>
      <AuthListener />
      <div className="bg-white">
        <ToastContainer />
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </Provider>
  );
}