import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import toast from "react-hot-toast";

const API = "https://internshala-clone-zril.onrender.com/api";

const PublicSpace = () => {
    const user = useSelector(selectuser);

    const [posts, setPosts] = useState([]);
    const [caption, setCaption] = useState("");
    const [media, setMedia] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${API}/post`);
            setPosts(res.data.posts);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load posts");
        }
    };

    const handleMedia = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setMedia(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please login first");
            return;
        }

        if (!caption.trim() && !media) {
            toast.error("Please enter a caption or choose a file");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("userId", user.uid);
            formData.append("userName", user.name);
            formData.append("userPhoto", user.photo || "");
            formData.append("caption", caption);

            if (media) {
                formData.append("media", media);
            }

            await axios.post(`${API}/post/create`, formData);

            toast.success("Post created");

            setCaption("");
            setMedia(null);
            setPreview("");

            fetchPosts();
        } catch (err) {
            console.log(err);
            toast.error("Upload failed");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">

            <div className="max-w-3xl mx-auto">

                <div className="bg-white rounded-xl shadow-lg p-6">

                    <h1 className="text-3xl font-bold mb-6">
                        🌍 Public Space
                    </h1>

                    <textarea
                        rows={4}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />

                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMedia}
                        className="mt-5"
                    />

                    {preview && (
                        <div className="mt-5">

                            {media?.type.startsWith("image") ? (

                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-full rounded-lg max-h-[400px] object-cover"
                                />

                            ) : (

                                <video
                                    controls
                                    src={preview}
                                    className="w-full rounded-lg max-h-[400px]"
                                />

                            )}

                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                    >

                        {loading ? "Uploading..." : "Create Post"}

                    </button>

                </div>

            </div>

        </div>
    );
};

export default PublicSpace;