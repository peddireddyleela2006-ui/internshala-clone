import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "@/firebase/firebase";
export default function Resume() {

    const router = useRouter();

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


    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            // Check if the user is logged in
            const firebaseUser = auth.currentUser;

            if (!firebaseUser) {
                alert("Please login first");
                return;
            }


            if (!firebaseUser?.email) {
                alert("User email not found");
                return;
            }

            const email = firebaseUser.email;

            const userResponse = await fetch(
                `https://internshala-clone-zril.onrender.com/api/user/email/${encodeURIComponent(email)}`
            );
            const userData = await userResponse.json();

            if (!userData.success) {
                alert("User not found");
                return;
            }

            const userId = userData.user._id;

            // Create resume
            const response = await fetch(
                "https://internshala-clone-zril.onrender.com/api/resume/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        ...formData,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Resume created successfully");
                router.push("/profile");
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
                    Create Resume
                </h1>


                <form onSubmit={handleSubmit} className="space-y-4">


                    <input
                        name="name"
                        placeholder="Full Name"
                        className="border p-3 w-full rounded"
                        onChange={handleChange}
                    />


                    <input
                        name="email"
                        placeholder="Email"
                        className="border p-3 w-full rounded"
                        onChange={handleChange}
                    />


                    <input
                        name="phone"
                        placeholder="Phone"
                        className="border p-3 w-full rounded"
                        onChange={handleChange}
                    />


                    <textarea
                        name="education"
                        placeholder="Education / Qualification"
                        className="border p-3 w-full rounded"
                        onChange={handleChange}
                    />


                    <textarea
                        name="skills"
                        placeholder="Skills"
                        className="border p-3 w-full rounded"
                        onChange={handleChange}
                    />


                    <textarea
                        name="experience"
                        placeholder="Experience"
                        className="border p-3 w-full rounded"
                        onChange={handleChange}
                    />


                    <textarea
                        name="about"
                        placeholder="About Me"
                        className="border p-3 w-full rounded"
                        onChange={handleChange}
                    />


                    <input
                        name="photo"
                        placeholder="Photo URL"
                        className="border p-3 w-full rounded"
                        onChange={handleChange}
                    />


                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-3 rounded w-full"
                    >
                        Create Resume
                    </button>


                </form>

            </div>

        </div>
    );
}