import { selectuser } from '@/Feature/Userslice';
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  User,
  Mail,
  ExternalLink,
  Monitor,
  Smartphone,
  Globe,
  Clock3,
} from "lucide-react";
interface User {
  name: string;
  email: string;
  photo: string;
}
const index = () => {
  const { t, i18n } = useTranslation();
  // const [user, setuser] = useState<User | null>({
  //     name: 'xxx',
  //     email: 'xxx@gmail.com',
  //     photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZfGyEcEdPfzca-b4iATLHuHIk80_yYMtRWw&s'

  // })
  const user = useSelector(selectuser);
  interface LoginHistory {
    _id: string;
    browser: string;
    operatingSystem: string;
    device: string;
    ipAddress: string;
    loginTime: string;
  }

  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLoginHistory = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(
          `https://internshala-clone-zril.onrender.com/api/loginhistory/${user.email}`
        );

        const data = await response.json();

        if (data.success) {
          setLoginHistory(data.history);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, [user]);
  // const dropdownref = useRef(null)

  // const handlelogin = () => {
  //     setuser({
  //         name: 'xxx',
  //         email: 'xxx@gmail.com',
  //         photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZfGyEcEdPfzca-b4iATLHuHIk80_yYMtRWw&s'
  //     });
  // };
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              {user?.photo ? (
                <img
                  src={user?.photo}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 pb-8 px-6">
            

              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">
                  {user?.name}
                </h1>

                <div className="mt-10 flex justify-center items-center text-gray-500">
                  <Mail size={30} className="mr-2" />

                  <h3 className="text-3xl font-bold text-gray-800">
                  {user?.email}
                </h3>
                </div>
              </div>
              <div className="space-y-6">
                {/* Quick Stats */}
                {/* <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <span className="text-blue-600 font-semibold text-2xl">
                      0
                    </span>
                    <p className="text-blue-600 text-sm mt-1">
                      {t("profile.ActiveApplications")}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <span className="text-green-600 font-semibold text-2xl">
                      0
                    </span>
                    <p className="text-green-600 text-sm mt-1">
                      {t("profile.AcceptedApplications")}
                    </p>
                  </div>
                </div> */}

                {/* Actions */}
                <div className="flex justify-center pt-4">

                  <Link
                    href="/userapplication"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {t("profile.ViewApplications")}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Stats */}

              {/* <div className="grid md:grid-cols-2 gap-6 mt-10">

                <div className="bg-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100">

                  <h2 className="text-4xl font-bold text-blue-600">
                    0
                  </h2>

                  <p className="text-blue-700 mt-2">
                    {t("profile.ActiveApplications")}
                  </p>

                </div>

                <div className="bg-green-50 rounded-2xl p-6 shadow-sm border border-green-100">

                  <h2 className="text-4xl font-bold text-green-600">
                    0
                  </h2>

                  <p className="text-green-700 mt-2">
                    {t("profile.AcceptedApplications")}
                  </p>

                </div>

              </div> */}

              {/* Button */}

              {/* <div className="flex justify-center mt-8">

                <Link
                  href="/userapplication"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition"
                >
                  {t("profile.ViewApplications")}
                  <ExternalLink size={18} />
                </Link>

              </div> */}

              {/* Login History */}

              <div className="mt-12">

                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Recent Login Activity
                </h2>

                {loading ? (

                  <div className="text-gray-500">
                    Loading...
                  </div>

                ) : loginHistory.length === 0 ? (

                  <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-500">
                    No login history found.
                  </div>

                ) : (

                  <div className="space-y-5">

                    {loginHistory.map((item: any) => (
                      <div
                        key={item._id}
                        className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition p-6"
                      >

                        <div className="flex justify-between items-start">

                          <div>

                            <div className="flex items-center gap-2">

                              {item.device === "Mobile" ? (
                                <Smartphone
                                  className="text-blue-600"
                                  size={22}
                                />
                              ) : (
                                <Monitor
                                  className="text-blue-600"
                                  size={22}
                                />
                              )}

                              <span className="font-bold text-lg text-gray-800">
                                {item.browser}
                              </span>

                            </div>

                            <p className="text-gray-500 mt-2">
                              {item.operatingSystem} • {item.device}
                            </p>

                            <div className="flex items-center gap-2 mt-3 text-gray-600">

                              <Globe size={17} />

                              <span>
                                {item.ipAddress.split(",")[0]}
                              </span>

                            </div>

                          </div>

                          <div className="flex items-center text-gray-500">

                            <Clock3
                              size={17}
                              className="mr-2"
                            />

                            <span className="text-sm">

                              {new Date(item.loginTime).toLocaleString()}

                            </span>

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>

                )}

              </div>

            </div>

            

          </div>
        </div>
      </div>
    
  )
}
export default index;