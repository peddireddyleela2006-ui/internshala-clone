import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import toast from "react-hot-toast";

//const API = "https://internshala-clone-zril.onrender.com/api";

const PublicSpace = () => {
    const user = useSelector(selectuser);
    const [commentText, setCommentText] = useState({});
    console.log("Redux User:", user);
    const [posts, setPosts] = useState([]);
    const [caption, setCaption] = useState("");
    const [media, setMedia] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);
    useEffect(() => {
        console.log("Browser Redux User:", user);
    }, [user]);
    const fetchPosts = async () => {
        try {
            const res = await axios.get(`https://internshala-clone-zril.onrender.com/api/post`);

            console.log("Fetched Posts:", res.data.posts);

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
        console.log("Create Post button clicked");
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

            await axios.post(`https://internshala-clone-zril.onrender.com/api/post/create`, formData);

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
    const handleLike = async (postId) => {
        try {

            await axios.put(`https://internshala-clone-zril.onrender.com/api/post/like/${postId}`, {
                userId: user.uid,
            });

            fetchPosts();

        } catch (err) {
            console.log(err);
            toast.error("Unable to like post");
        }
    };
    const handleComment = async (postId) => {

        if (!commentText[postId]?.trim()) {
            toast.error("Enter a comment");
            return;
        }

        try {

            await axios.post(`https://internshala-clone-zril.onrender.com/api/post/comment/${postId}`, {

                userId: user.uid,
                userName: user.name,
                userPhoto: user.photo,
                comment: commentText[postId],

            });

            toast.success("Comment added");

            setCommentText((prev) => ({
                ...prev,
                [postId]: "",
            }));

            fetchPosts();

        } catch (err) {

            console.log(err);

            toast.error("Failed to add comment");

        }
    };
    const handleDelete = async (postId) => {

        if (!user) {
            toast.error("Please login first");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmDelete) return;


        try {

            await axios.delete(
                `https://internshala-clone-zril.onrender.com/api/post/${postId}`
            );


            toast.success("Post deleted");


            fetchPosts();


        } catch (err) {

            console.log(err);

            toast.error("Delete failed");

        }

    };
    const isLiked = (post) => {
        if (!user) return false;

        return post.likes.includes(user.uid);
    };
    return (
        <div className=" min-h-screen bg-gray-100 py-8">
            <div className="text-black max-w-3xl mx-auto">

                {/* CREATE POST */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

                    <h1 className="text-3xl font-bold mb-6">
                        🌍 Public Space
                    </h1>

                    <textarea
                        rows={4}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full border border-black rounded-lg p-3 outline-none resize-none"
                    />

                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMedia}
                        className="mt-4"
                    />

                    {preview && (
                        <div className="mt-4">

                            {media?.type.startsWith("image") ? (

                                <img
                                    src={preview}
                                    alt="preview"
                                    className="rounded-lg w-full max-h-96 object-cover"
                                />

                            ) : (

                                <video
                                    src={preview}
                                    controls
                                    className="rounded-lg w-full max-h-96"
                                />

                            )}

                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        {loading ? "Uploading..." : "Create Post"}
                    </button>

                </div>

                {/* POSTS */}

                {posts.length === 0 ? (

                    <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
                        No posts yet.
                    </div>

                ) : (

                    posts.map((post, index) => (

                        <div
                            key={post._id}
                            className="bg-white rounded-xl shadow-lg p-6 mb-6"
                        >

                            {/* User */}

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <img
                                        src={
                                            post.userPhoto
                                                ? post.userPhoto
                                                : `https://ui-avatars.com/api/?name=${post.userName}`
                                        }
                                        className="w-12 h-12 rounded-full"
                                    />

                                    <div>

                                        <h2 className="font-semibold">
                                            {post.userName}
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            {new Date(post.createdAt).toLocaleString()}
                                        </p>

                                    </div>

                                </div>


                                {
                                    user?.uid === post.userId && (

                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="text-red-500 hover:text-red-700 font-semibold"
                                        >
                                            Delete
                                        </button>

                                    )
                                }


                            </div>

                            {/* Caption */}

                            {post.caption && (

                                <p className="mt-4 text-gray-800">
                                    {post.caption}
                                </p>

                            )}

                            {/* Image */}

                            {post.mediaType === "image" && (

                                <img
                                    src={post.mediaUrl}
                                    className="mt-4 rounded-lg w-full"
                                />

                            )}

                            {/* Video */}

                            {post.mediaType === "video" && (

                                <video
                                    controls
                                    src={post.mediaUrl}
                                    className="mt-4 rounded-lg w-full"
                                />

                            )}

                            {/* Footer */}

                            {/* Footer */}

                            <div className="mt-5 flex justify-between items-center">

                                <button
                                    onClick={() => handleLike(post._id)}
                                    className={
                                        isLiked(post)
                                            ? "text-red-500 font-semibold"
                                            : "text-gray-600 hover:text-red-500 font-semibold"
                                    }
                                >
                                    {isLiked(post) ? "❤️" : "🤍"} {post.likes.length} Likes
                                </button>

                                <span className="text-gray-600">
                                    💬 {post.comments.length} Comments
                                </span>

                            </div>

                            {/* Comment Box */}

                            <div className="mt-4 flex gap-2">

                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={commentText[post._id] || ""}
                                    onChange={(e) =>
                                        setCommentText((prev) => ({
                                            ...prev,
                                            [post._id]: e.target.value,
                                        }))
                                    }
                                    className="flex-1 border rounded-lg px-3 py-2"
                                />

                                <button
                                    onClick={() => handleComment(post._id)}
                                    className="bg-blue-600 text-white px-4 rounded-lg"
                                >
                                    Comment
                                </button>

                            </div>

                            {/* Comments */}

                            <div className="mt-4">

                                {post.comments.map((comment) => (

                                    <div
                                        key={comment._id}
                                        className="border-b py-2"
                                    >

                                        <span className="font-semibold">
                                            {comment.userName}
                                        </span>

                                        <span className="ml-2">
                                            {comment.comment}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>

                    ))

                )}

            </div>
        </div>
    );
};

export default PublicSpace;