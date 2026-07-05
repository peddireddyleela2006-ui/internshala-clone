import axios from 'axios';
import { Briefcase, Calendar, DollarSign, Info, MapPin, Tags, User, Users } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const index = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    Experience: "",
    category: "",
    aboutCompany: "",
    aboutJob: "",
    whoCanApply: "",
    perks: "",
    numberOfOpening: "",
    CTC: "",
    StartDate: "",
    AdditionalInfo: "",
  });
  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const router = useRouter();
  const [isloading, setisloading] = useState(false)
  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("FORM DATA");

    Object.entries(formData).forEach(([key, value]) => {
      console.log(key, "=", value);
    });
    const hasemptyfiels = Object.values(formData).some(
      value => String(value).trim() === ""
    ); if (hasemptyfiels) {
      toast.error("toast.fillInAllDetails");
      return;
    }

    try {
      setisloading(true);
      const res = await axios.post("http://localhost:5000/api/job", formData);
      toast.success("toast.jobPosted");
      router.push('/adminpanel')

    } catch (error: any) {
      console.log("FULL ERROR:", error);

      if (error.response) {
        console.log("Response Data:", error.response.data);
        console.log("Status:", error.response.status);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error:", error.message);
      }

      toast.error("toast.jobPostFailed");
    } finally {
      setisloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("postjob.title")}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {t("postjob.subt")}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handlesubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      {/* <Briefcase className="h-4 w-4 mr-1" /> */}
                      {t("postjob.Title")}*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handlechange}
                    className="text-black  mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={t("postjob.jobname")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      {/* <Building2 className="h-4 w-4 mr-1" /> */}
                      {t("postjob.CompanyName")}*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handlechange}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={t("postjob.companyname")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      {/* <Building2 className="h-4 w-4 mr-1" /> */}
                      {t("postjob.Experience")}*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="Experience"
                    value={formData.Experience}
                    onChange={handlechange}
                    placeholder={t("postjob.exp")}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {t("postjob.Location")}*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handlechange}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={t("postjob.place")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <Tags className="h-4 w-4 mr-1" />
                      {t("postjob.Category")}*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handlechange}
                    className=" text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={t("postjob.c")}
                  />
                </div>
              </div>
            </div>

            {/* Company & Job Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    {t("postjob.AboutCompany")}*
                  </div>
                </label>
                <textarea
                  name="aboutCompany"
                  value={formData.aboutCompany}
                  onChange={handlechange}
                  rows={4}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={t("postjob.eg_comp")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {t("postjob.AboutInternship")}*
                  </div>
                </label>
                <textarea
                  name="aboutJob"
                  value={formData.aboutJob}
                  onChange={handlechange}
                  rows={4}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={t("postjob.describeinternship")}
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    {t("postjob.WhoCanApply")}*
                  </div>
                </label>
                <textarea
                  name="whoCanApply"
                  value={formData.whoCanApply}
                  onChange={handlechange}
                  rows={3}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={t("postjob.placewca")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    {t("postjob.Perks")}*
                  </div>
                </label>
                <textarea
                  name="perks"
                  value={formData.perks}
                  onChange={handlechange}
                  rows={3}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={t("postjob.perklist")}
                />
              </div>
            </div>

            {/* Final Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    {t("postjob.NumberofOpenings")}*
                  </div>
                </label>
                <input
                  type="number"
                  name="numberOfOpening"
                  value={formData.numberOfOpening}
                  onChange={handlechange}
                  min="1"
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={t("postjob.num")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {t("postjob.CTC")}*
                  </div>
                </label>
                <input
                  type="text"
                  name="CTC"
                  value={formData.CTC}
                  onChange={handlechange}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={t("postjob.sal")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {t("postjob.StartDate")}*
                  </div>
                </label>
                <input
                  type="date"
                  name="StartDate"
                  value={formData.StartDate}
                  onChange={handlechange}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    {t("postjob.AdditionalInformation")}*
                  </div>
                </label>
                <textarea
                  name="AdditionalInfo"
                  value={formData.AdditionalInfo}
                  onChange={handlechange}
                  rows={3}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={t("postjob.add")}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isloading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isloading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    {t("postjob.PostingInternship")}...
                  </div>
                ) : (
                  <p>{t("postjob.PostInternship")}</p>
                )
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default index;
