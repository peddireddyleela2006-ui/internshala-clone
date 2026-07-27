import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
export default function Resume() {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        education: "",
        skills: "",
        experience: "",
        about: "",
        photo: "",
    });

    

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

            if (!firebaseUser?.email) return;

            const userResponse = await fetch(
                `https://internshala-clone-zril.onrender.com/api/user/email/${encodeURIComponent(firebaseUser.email)}`
            );

            const userData = await userResponse.json();

            if (!userData.success) return;

            setUserId(userData.user._id);

            const resumeResponse = await fetch(
                `https://internshala-clone-zril.onrender.com/api/resume/${userData.user._id}`
            );

            const resumeData = await resumeResponse.json();

            if (resumeData.success) {
                setIsEditing(true);

                setFormData({
                    name: resumeData.resume.name || "",
                    email: resumeData.resume.email || "",
                    phone: resumeData.resume.phone || "",
                    education: resumeData.resume.education || "",
                    skills: resumeData.resume.skills || "",
                    experience: resumeData.resume.experience || "",
                    about: resumeData.resume.about || "",
                    photo: resumeData.resume.photo || "",
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const firebaseUser = auth.currentUser;

            if (!firebaseUser?.email) {
                alert("Please login first");
                return;
            }

            const userResponse = await fetch(
                `https://internshala-clone-zril.onrender.com/api/user/email/${encodeURIComponent(firebaseUser.email)}`
            );

            const userData = await userResponse.json();

            if (!userData.success) {
                alert("User not found");
                return;
            }

            const mongoUserId = userData.user._id;
            let response;
            if (isEditing) {
                // UPDATE RESUME
                response = await fetch(
                    `https://internshala-clone-zril.onrender.com/api/resume/${mongoUserId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    }
                );
            } else {
                // CREATE RESUME
                response = await fetch(
                    "https://internshala-clone-zril.onrender.com/api/resume/create",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: mongoUserId,
                            ...formData,
                        }),
                    }
                );
            }

            const data = await response.json();

            if (data.success) {
                alert(
                    isEditing
                        ? "Resume updated successfully!"
                        : "Resume created successfully!"
                );

                router.push("/resume/view");
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };


    return (
        <div className="min-h-screen flex justify-center text-black items-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Resume
                </h1>


                <form onSubmit={handleSubmit} className="space-y-4">


                    <input
                        name="name"
                        placeholder="Full Name"
                        className="border p-3 w-full rounded"
                        value={formData.name}
                        onChange={handleChange}
                    />


                    <input
                        name="email"
                        placeholder="Email"
                        className="border p-3 w-full rounded"
                        value={formData.email}
                        onChange={handleChange}
                    />


                    <input
                        name="phone"
                        placeholder="Phone"
                        className="border p-3 w-full rounded"
                        value={formData.phone}
                        onChange={handleChange}
                    />


                    <textarea
                        name="education"
                        placeholder="Education / Qualification"
                        className="border p-3 w-full rounded"
                        value={formData.education}
                        onChange={handleChange}
                    />


                    <textarea
                        name="skills"
                        placeholder="Skills"
                        className="border p-3 w-full rounded"
                        value={formData.skills}
                        onChange={handleChange}
                    />


                    <textarea
                        name="experience"
                        placeholder="Experience"
                        className="border p-3 w-full rounded"
                        value={formData.experience}
                        onChange={handleChange}
                    />


                    <textarea
                        name="about"
                        placeholder="About Me"
                        className="border p-3 w-full rounded"
                        value={formData.about}
                        onChange={handleChange}
                    />


                    <input
                        name="photo"
                        placeholder="Photo URL"
                        className="border p-3 w-full rounded"
                        value={formData.photo}
                        onChange={handleChange}
                    />


                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-3 rounded w-full"
                    >
                        {isEditing ? "Update Resume" : "Create Resume"}
                    </button>


                </form>

            </div>

        </div>
    );
}