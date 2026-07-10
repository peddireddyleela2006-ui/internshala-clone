import axios from 'axios';
import { Briefcase, Calendar, DollarSign, Info, MapPin, Tags, User, Users } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
//import { useTranslation } from 'react-i18next';

const index = () => {
  //const { t, i18n } = useTranslation();
    const [formadata, setformadata] = useState({
        title: "",
        company: "",
        location:"",
        category:"",
        aboutCompany:"",
        aboutInternship:"",
        whoCanApply:"",
        perks:"",
        numberOfOpenings:"",
        stipend:"",
        startDate:"",
        additionalInfo:""
    })
    const handlechange = (e: any) => {
        const { name, value } = e.target;
        setformadata(prev => ({
          ...prev,
          [name]: value
        }))
      }
      const router = useRouter();
      const [isloading, setisloading] = useState(false)
      const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("FORM DATA");
    
        Object.entries(formadata).forEach(([key, value]) => {
          console.log(key, "=", value);
        });
        const hasemptyfiels = Object.values(formadata).some(
          value => String(value).trim() === ""
        ); if (hasemptyfiels) {
          toast.error("toast.fillInAllDetails");
          return;
        }
    
        try {
          setisloading(true);
          const res = await axios.post("http://localhost:5000/api/internship", formadata);
          toast.success("toast.internshipPosted");
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
    
          toast.error("toast.internshipPostFailed");
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
              {("postintern.title")}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {("postintern.subt")}
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
                      {("postintern.Title")}*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formadata.title}
                    onChange={handlechange}
                    className="text-black  mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={("postintern.internshipname")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      {/* <Building2 className="h-4 w-4 mr-1" /> */}
                      {("postintern.CompanyName")}*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formadata.company}
                    onChange={handlechange}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={("postintern.companyname")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {("postintern.Location")}*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formadata.location}
                    onChange={handlechange}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={("postintern.place")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <Tags className="h-4 w-4 mr-1" />
                      {("postintern.Category")}*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formadata.category}
                    onChange={handlechange}
                    className=" text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={("postintern.c")}
                  />
                </div>
              </div>
            </div>

            {/* Company & Internship Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    {("postintern.AboutCompany")}*
                  </div>
                </label>
                <textarea
                  name="aboutCompany"
                  value={formadata.aboutCompany}
                  onChange={handlechange}
                  rows={4}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={("postintern.eg_comp")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {("postintern.AboutInternship")}*
                  </div>
                </label>
                <textarea
                  name="aboutInternship"
                  value={formadata.aboutInternship}
                  onChange={handlechange}
                  rows={4}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={("postintern.describeinternship")}
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    {("postintern.WhoCanApply")}*
                  </div>
                </label>
                <textarea
                  name="whoCanApply"
                  value={formadata.whoCanApply}
                  onChange={handlechange}
                  rows={3}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={("postintern.placewca")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    {("postintern.Perks")}*
                  </div>
                </label>
                <textarea
                  name="perks"
                  value={formadata.perks}
                  onChange={handlechange}
                  rows={3}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={("postintern.perklist")}
                />
              </div>
            </div>

            {/* Final Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    {("postintern.NumberofOpenings")}*
                  </div>
                </label>
                <input
                  type="number"
                  name="numberOfOpenings"
                  value={formadata.numberOfOpenings}
                  onChange={handlechange}
                  min="1"
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={("postintern.num")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {("postintern.Stipend")}*
                  </div>
                </label>
                <input
                  type="text"
                  name="stipend"
                  value={formadata.stipend}
                  onChange={handlechange}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={("postintern.sal")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {("postintern.StartDate")}*
                  </div>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formadata.startDate}
                  onChange={handlechange}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    {("postintern.AdditionalInformation")}*
                  </div>
                </label>
                <textarea
                  name="additionalInfo"
                  value={formadata.additionalInfo}
                  onChange={handlechange}
                  rows={3}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={("postintern.add")}
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
                    {("postintern.PostingInternship")}...
                  </div>
                ) : (
                  <p>{("postintern.PostInternship")}</p>
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
