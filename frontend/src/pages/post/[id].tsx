import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface Comment {
  _id: string;
  userName: string;
  comment: string;
}

interface Post {
  _id: string;
  userName: string;
  userPhoto: string;
  caption: string;
  mediaUrl: string;
  mediaType: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
}

const PostDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !id) return;

    fetchPost();
  }, [router.isReady, id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(
        `https://internshala-clone-zril.onrender.com/api/post/${id}`
      );

      setPost(res.data.post);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Post not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">

        {/* User */}

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
            <h2 className="font-semibold text-lg">
              {post.userName}
            </h2>

            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>

        </div>

        {/* Caption */}

        {post.caption && (
          <p className="mt-5 text-gray-800 text-lg">
            {post.caption}
          </p>
        )}

        {/* Image */}

        {post.mediaType === "image" && (

          <img
            src={post.mediaUrl}
            className="mt-5 rounded-lg w-full"
          />

        )}

        {/* Video */}

        {post.mediaType === "video" && (

          <video
            controls
            src={post.mediaUrl}
            className="mt-5 rounded-lg w-full"
          />

        )}

        {/* Likes */}

        <div className="mt-6 font-semibold">
          ❤️ {post.likes.length} Likes
        </div>

        {/* Comments */}

        <div className="mt-6">

          <h3 className="font-bold text-lg mb-3">
            Comments
          </h3>

          {post.comments.length === 0 ? (

            <p>No comments yet.</p>

          ) : (

            post.comments.map((comment) => (

              <div
                key={comment._id}
                className="border-b py-3"
              >

                <span className="font-semibold">
                  {comment.userName}
                </span>

                <span className="ml-2">
                  {comment.comment}
                </span>

              </div>

            ))

          )}

        </div>

      </div>
    </div>
  );
};

export default PostDetails;