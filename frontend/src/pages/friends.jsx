import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import toast from "react-hot-toast";

const API = "https://internshala-clone-zril.onrender.com/api";

const Friends = () => {
    const user = useSelector(selectuser);

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(
                `${API}/friend/requests/${user._id}`
            );

            setRequests(res.data.requests);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load requests");
        }
    };

    const acceptRequest = async (id) => {
        try {
            await axios.put(`${API}/friend/accept/${id}`);

            toast.success("Friend request accepted");

            fetchRequests();
        } catch (err) {
            console.log(err);
            toast.error("Failed");
        }
    };

    const rejectRequest = async (id) => {
        try {
            await axios.delete(`${API}/friend/reject/${id}`);

            toast.success("Request rejected");

            fetchRequests();
        } catch (err) {
            console.log(err);
            toast.error("Failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-3xl font-bold mb-6">
                    Friend Requests
                </h1>

                {requests.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow">
                        No friend requests.
                    </div>
                ) : (
                    requests.map((request) => (
                        <div
                            key={request._id}
                            className="bg-white shadow rounded-lg p-5 mb-4"
                        >
                            <h2 className="font-semibold">
                                {request.sender.name}
                            </h2>

                            <p className="text-gray-500 text-sm">
                                {request.sender.email}
                            </p>

                            <div className="flex gap-3 mt-4">

                                <button
                                    onClick={() =>
                                        acceptRequest(request._id)
                                    }
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() =>
                                        rejectRequest(request._id)
                                    }
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Reject
                                </button>

                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Friends;