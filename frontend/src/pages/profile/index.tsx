import { selectuser } from '@/Feature/Userslice';
import { ExternalLink, Mail, User } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <div className="mt-2 flex items-center justify-center text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                <span>{user?.email}</span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Actions */}
              <div className="flex justify-center pt-4">
                <div className="mt-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Login History
                  </h2>

                  {loading ? (
                    <p className="text-gray-500">Loading...</p>
                  ) : loginHistory.length === 0 ? (
                    <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-500">
                      No login history found.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {loginHistory.map((item: any) => (
                        <div
                          key={item._id}
                          className="bg-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition"
                        >
                          <div className="grid md:grid-cols-2 gap-4">

                            <div>
                              <p className="text-sm text-gray-500">
                                Browser
                              </p>
                              <p className="font-semibold text-gray-800">
                                {item.browser}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500">
                                Operating System
                              </p>
                              <p className="font-semibold text-gray-800">
                                {item.operatingSystem}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500">
                                Device
                              </p>
                              <p className="font-semibold text-gray-800">
                                {item.device}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500">
                                IP Address
                              </p>
                              <p className="font-semibold text-gray-800">
                                {item.ipAddress}
                              </p>
                            </div>

                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-500">
                                Login Time
                              </p>
                              <p className="font-semibold text-gray-800">
                                {new Date(item.loginTime).toLocaleString()}
                              </p>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Link
                  href="/userapplication"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {t("profile.ViewApplications")}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default index;