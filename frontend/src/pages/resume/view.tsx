import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";
import {
    Mail,
    Phone,
    GraduationCap,
    Briefcase,
    User,
    Code2,
} from "lucide-react";
export default function ResumeView() {
    const [resume, setResume] = useState<any>(null);

    useEffect(() => {
        fetchResume();
    }, []);

    const fetchResume = async () => {
        try {
            const firebaseUser = auth.currentUser;

            if (!firebaseUser?.email) return;

            // Get MongoDB user
            const userResponse = await fetch(
                `https://internshala-clone-zril.onrender.com/api/user/email/${encodeURIComponent(firebaseUser.email)}`
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

    if (!resume) {
        return (
            <div className="text-center mt-10 text-xl">
                Loading Resume...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

                {/* Profile Section */}
                <div className="p-10">

                    <div className="flex flex-col md:flex-row gap-8 items-center">

                        <img
                            src={resume.photo}
                            alt="Profile"
                            className="w-40 h-40 rounded-full border-4 border-gray-200 object-cover shadow"
                        />

                        <div className="flex-1">

                            <h1 className="text-5xl font-bold text-gray-900">
                                {resume.name}
                            </h1>

                            <p className="text-lg text-black">
                                Student
                            </p>

                            <div className="flex flex-col gap-3 mt-5 text-gray-700">

                                <div className="text-lg text-gray-600">
                                    <Mail size={20} className="text-blue-700" />
                                    {resume.email}
                                </div>

                                <div className="text-lg text-gray-600">
                                    <Phone size={20} className="text-blue-700" />
                                    {resume.phone}
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Divider */}

                <div className="border-t"></div>

                {/* About */}

                <section className="p-10">

                    <div className="flex items-center gap-3 mb-6">

    <User className="w-6 h-6 text-blue-600"/>

    <h2 className="text-2xl font-bold text-gray-900">
        About
    </h2>

</div>

                    <p className="text-gray-700 leading-8 whitespace-pre-wrap">
                        {resume.about || "No description added."}
                    </p>

                </section>

                <div className="border-t"></div>

                {/* Skills */}

                <section className="p-10">

                    <div className="flex items-center gap-3 mb-5">
                        <Code2 className="text-blue-700" />
                        <h2 className="text-2xl font-semibold text-slate-800">
                            Skills
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-3">

                        {resume.skills
                            ? resume.skills.split(",").map((skill: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium"
                                >
                                    {skill.trim()}
                                </span>
                            ))
                            : (
                                <p className="text-2xl font-semibold text-slate-800">
                                    No skills added.
                                </p>
                            )}

                    </div>

                </section>

                <div className="border-t"></div>

                {/* Experience */}

                <section className="p-10">

                    <div className="flex items-center gap-3 mb-5">
                        <Briefcase className="text-blue-700" />
                        <h2 className="text-2xl font-semibold text-slate-800">
                            Experience
                        </h2>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6">

                        <p className="text-gray-700 whitespace-pre-wrap leading-8">
                            {resume.experience || "No experience added."}
                        </p>

                    </div>

                </section>

                <div className="border-t"></div>

                {/* Education */}

                <section className="p-10">

                    <div className="flex items-center gap-3 mb-5">
                        <GraduationCap className="text-blue-700" />
                        <h2 className="text-2xl font-semibold text-slate-800">
                            Education
                        </h2>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6">

                        <p className="text-gray-700 whitespace-pre-wrap leading-8">
                            {resume.education || "No education added."}
                        </p>

                    </div>
                    <div className="mt-6 flex gap-3">

                        <button className="
bg-blue-600
hover:bg-blue-700
text-white
font-semibold
px-5
py-3
rounded-lg
transition
">
                            Download Resume
                        </button>

                        <button className="
bg-blue-600
hover:bg-blue-700
text-white
font-semibold
px-5
py-3
rounded-lg
transition
">
                            Edit Resume
                        </button>

                    </div>
                </section>

            </div>
        </div>
    );
}
