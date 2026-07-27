import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useReactToPrint } from "react-to-print";
import {
    Mail,
    Phone,
    GraduationCap,
    Briefcase,
    User,
    Code2,
} from "lucide-react";
export default function ResumeView() {
    const router = useRouter();
    const resumeRef = useRef<HTMLDivElement>(null);
    const [resume, setResume] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchResume();
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchResume = async () => {
        try {
            const firebaseUser = auth.currentUser;

            if (!firebaseUser) {
                alert("Please login");
                return;
            }

            // Get MongoDB user
            const userResponse = await fetch(
                `https://internshala-clone-zril.onrender.com/api/user/email/${encodeURIComponent(firebaseUser.email!)}`
            );

            const userData = await userResponse.json();

            if (!userData.success) return;

            const userId = userData.user._id;
            console.log("User ID:", userId);
            // Get Resume
            const resumeResponse = await fetch(
                `https://internshala-clone-zril.onrender.com/api/resume/${userId}`
            );

            const resumeData = await resumeResponse.json();
            console.log("Resume Data:", resumeData);

            if (resumeData.success) {
                setResume(resumeData.resume);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const downloadResume = useReactToPrint({
        contentRef: resumeRef,
        documentTitle: `${resume?.name || "Resume"}_Resume`,
    });
    if (!resume) {
        return (
            <div className="text-center text-black font-bold mt-10 text-xl">
                Loading Your Resume
                <p>please wait...</p>
            </div>
        );
    }

    // return (
    //     <div
    //         ref={resumeRef}
    //         className="min-h-screen bg-slate-100 py-10 px-4"
    //     >
    //         <div className="max-w-5xl mx-auto bg-white rounded-md shadow-sm overflow-hidden">

    //             {/* Profile Section */}
    //             <div className="p-6">

    //                 <div className="flex flex-col md:flex-row gap-8 items-center">

    //                     <img
    //                         src={resume.photo}
    //                         alt="Profile"
    //                         className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover shadow"
    //                     />

    //                     <div className="flex-1">

    //                         <h1 className="text-5xl font-bold text-gray-900">
    //                             {resume.name}
    //                         </h1>

    //                         <p className="text-lg text-black">
    //                             Student
    //                         </p>
    //                         <div className="flex flex-wrap gap-8 mt-4 text-gray-600">

    //                             <div className="flex items-center gap-2">
    //                                 <Mail size={18} />
    //                                 <span>{resume.email}</span>
    //                             </div>
    //                         </div>
    //                         <div className="flex flex-wrap gap-8 mt-4 text-gray-600">
    //                             <div className="flex items-center gap-2">
    //                                 <Phone size={18} />
    //                                 <span>{resume.phone}</span>
    //                             </div>
    //                         </div>
    //                     </div>

    //                 </div>

    //             </div>

    //             {/* Divider */}
    //             <div className="border-b border-gray-200"></div>

    //             {/* About */}

    //             <section className="p-6">

    //                 <div className="flex items-center gap-3 mb-6">

    //                     

    //                     <h2 className="text-2xl uppercase font-bold text-gray-900">
    //                         About
    //                     </h2>

    //                 </div>

    //                 <p className="text-gray-700 leading-8 whitespace-pre-wrap">
    //                     {resume.about || "No description added."}
    //                 </p>

    //             </section>

    //             <div className="border-b border-gray-200"></div>

    //             {/* Skills */}

    //             <section className="p-6">

    //                 <div className="flex items-center gap-3 mb-5">
    //                     
    //                     <h2 className="text-2xl uppercase font-semibold text-slate-800">
    //                         Skills
    //                     </h2>
    //                 </div>

    //                 <div className="flex flex-wrap gap-3">

    //                     {resume.skills
    //                         ? resume.skills.split(",").map((skill: string, index: number) => (
    //                             <span
    //                                 key={index}
    //                                 className="px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium"
    //                             >
    //                                 {skill.trim()}
    //                             </span>
    //                         ))
    //                         : (
    //                             <p className="text-2xl font-semibold text-slate-800">
    //                                 No skills added.
    //                             </p>
    //                         )}

    //                 </div>

    //             </section>
    //             <div className="border-b border-gray-200"></div>

    //             {/* Experience */}

    //             <section className="p-6">

    //                 <div className="flex items-center gap-3 mb-5">
    //                     
    //                     <h2 className="text-2xl uppercase font-semibold text-slate-800">
    //                         Experience
    //                     </h2>
    //                 </div>

    //                 <div className="border-l-4 border-blue-500 pl-6">

    //                     <p className="text-gray-700 whitespace-pre-wrap leading-8">
    //                         {resume.experience || "No experience added."}
    //                     </p>

    //                 </div>

    //             </section>

    //             <div className="border-b border-gray-200"></div>

    //             {/* Education */}

    //             <section className="p-6">

    //                 <div className="flex items-center gap-3 mb-5">
    //                     
    //                     <h2 className="text-2xl uppercase font-semibold text-slate-800">
    //                         Education
    //                     </h2>
    //                 </div>

    //                 <div className="border-l-4 border-blue-500 pl-6">

    //                     <p className="text-gray-700 whitespace-pre-wrap leading-8">
    //                         {resume.education || "No education added."}
    //                     </p>

    //                 </div>
    //                 <div className="mt-6 flex gap-3">

    //                     <button
    //                         onClick={downloadResume}
    //                         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition"
    //                     >
    //                         Download Resume
    //                     </button>

    //                     <button
    //                         onClick={() => router.push("/resume")}
    //                         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition"
    //                     >
    //                         Edit Resume
    //                     </button>

    //                 </div>
    //             </section>

    //         </div>
    //     </div>
    // );
    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            {/* Resume */}
            <div
                ref={resumeRef}
                className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-8">

                    <img
                        src={resume.photo}
                        alt="Profile"
                        className="w-28 h-28 rounded-full border object-cover"
                    />

                    <div className="flex-1">

                        <h1 className="text-4xl font-bold text-gray-900">
                            {resume.name}
                        </h1>

                        <p className="text-lg text-gray-500 mt-1">
                            Student
                        </p>

                        <div className="flex flex-wrap gap-6 mt-5 text-gray-600">

                            <div className="flex items-center gap-2">
                                <Mail size={18} />
                                <span>{resume.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone size={18} />
                                <span>{resume.phone}</span>
                            </div>

                        </div>

                    </div>

                </div>

                <hr />

                {/* About */}
                <section className="p-8">

                    <h2 className="text-lg font-bold uppercase tracking-wider text-blue-700 mb-4">
                        <User className="w-6 h-6 text-blue-600" />
                        About
                    </h2>

                    <p className="text-gray-700 leading-7">
                        {resume.about || "No description added."}
                    </p>

                </section>

                <hr />

                {/* Skills */}
                <section className="p-8">

                    <h2 className="text-lg font-bold uppercase tracking-wider text-blue-700 mb-4">
                        <Code2 className="text-blue-700" />
                        Skills
                    </h2>

                    <p className="text-gray-700 leading-7">
                        {resume.skills
                            ? resume.skills
                                .split(",")
                                .map((skill: string) => skill.trim())
                                .join(" • ")
                            : "No skills added"}
                    </p>

                </section>

                <hr />

                {/* Education */}
                <section className="p-8">

                    <h2 className="text-lg font-bold uppercase tracking-wider text-blue-700 mb-4">
                        <GraduationCap className="text-blue-700" />
                        Education
                    </h2>

                    <p className="text-gray-700 leading-7">
                        {resume.education || "No education added."}
                    </p>

                </section>

                <hr />

                {/* Experience */}
                <section className="p-8">

                    <h2 className="text-lg font-bold uppercase tracking-wider text-blue-700 mb-4">
                        <Briefcase className="text-blue-700" />
                        Experience
                    </h2>

                    <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                        {resume.experience || "No experience added."}
                    </p>

                </section>

            </div>
            {/* Action Buttons */}
            <div className="max-w-4xl mx-auto flex justify gap-4 mb-6">

                <button
                    onClick={downloadResume}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition"
                >
                    Download Resume
                </button>

                <button
                    onClick={() => router.push("/resume")}
                    className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-5 py-2 rounded-lg transition"
                >
                    Edit Resume
                </button>

            </div>
        </div>
    );
}
