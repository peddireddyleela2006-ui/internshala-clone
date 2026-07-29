import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { selectuser } from "@/Feature/Userslice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const API =
    "https://internshala-clone-zril.onrender.com/api";

export default function Friends() {
    const { t } = useTranslation();
    const user = useSelector(selectuser);
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [sentRequests, setSentRequests] = useState<string[]>([]);
    const [friendIds, setFriendIds] = useState<string[]>([]);
    useEffect(() => {

        if (user?._id) {
            loadUsers();
            loadRequests();
            loadFriends();
        }

    }, [user]);



    const loadUsers = async () => {

        const res = await axios.get(
            `${API}/friend/users/${user._id}`
        );

        setUsers(res.data.users);

        setSentRequests(
            res.data.sentRequests
        );

        setFriendIds(
            res.data.friends
        );

    };



    const loadRequests = async () => {

        const res = await axios.get(
            `${API}/friend/requests/${user._id}`
        );

        setRequests(res.data.requests);

    };



    const loadFriends = async () => {

        const res = await axios.get(
            `${API}/friend/list/${user._id}`
        );

        setFriends(res.data.friends);

    };



    const sendRequest = async (id: string) => {

        try {

            await axios.post(
                `${API}/friend/send-request`,
                {
                    senderId: user._id,
                    receiverId: id
                }
            );

            toast.success("Request sent");

            loadUsers();

        }
        catch (err: any) {

            toast.error(
                err.response?.data?.message || "Failed"
            );

        }

    };



    const acceptRequest = async (id: string) => {

        try {

            await axios.put(
                `${API}/friend/accept/${id}`
            );

            toast.success("Friend request accepted");

            loadRequests();
            loadFriends();

        }
        catch (error: any) {

            toast.error(
                error.response?.data?.message || "Failed"
            );

        }

    };



    const rejectRequest = async (id: string) => {

        try {

            await axios.delete(
                `${API}/friend/reject/${id}`
            );

            toast.success("Request rejected");

            loadRequests();

        }
        catch (error: any) {

            toast.error(
                error.response?.data?.message || "Failed"
            );

        }

    };


    return (

        <div className="min-h-screen bg-gray-100 p-6 text-black">

            <div className="max-w-5xl mx-auto">


                <h1 className="text-4xl font-bold mb-8">
                    {t("friends.Friends")}
                </h1>


                {/* FRIENDS */}




                <section className="bg-white rounded-xl shadow p-6 mb-8">

                    <h2 className="text-2xl font-semibold mb-5">
                        {t("friends.MyFriends")}
                    </h2>

                    {
                        friends.length === 0 ? (

                            <p className="text-gray-500">
                                {t("friends.Nofriendsyet")}
                            </p>

                        ) : (

                            <div className="grid md:grid-cols-2 gap-5">

                                {
                                    friends.map((friend: any) => (

                                        <div
                                            key={friend._id}
                                            className="border rounded-xl p-5 flex justify-between items-center hover:shadow-lg transition"
                                        >

                                            <div>

                                                <h3 className="font-semibold text-lg">
                                                    {friend.name}
                                                </h3>

                                                <p className="text-gray-500 text-sm">
                                                    {friend.email}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    console.log(friend);
                                                    router.push(`/chat/${friend._id}`);
                                                }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                                            >
                                                {t("friends.Chat")}
                                            </button>
                                        </div>

                                    ))
                                }

                            </div>

                        )
                    }

                </section>

                {/* REQUESTS */}

                <section className="bg-white rounded-xl shadow p-6 mb-8">

                    <h2 className="text-2xl font-semibold mb-5">
                        {t("friends.FriendRequests")}
                    </h2>


                    {
                        requests.length === 0 ? (

                            <p className="text-gray-500">
                                {t("friends.Nopendingrequests")}
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {
                                    requests.map((req: any) => (

                                        <div
                                            key={req._id}
                                            className="flex justify-between items-center border rounded-xl p-4  "
                                        >

                                            <div>

                                                <h3 className="font-semibold">
                                                    {req.sender.name}
                                                </h3>

                                                <p className="text-gray-500 text-sm">
                                                    {req.sender.email}
                                                </p>

                                            </div>



                                            <div className="flex gap-3">


                                                <button
                                                    onClick={() => acceptRequest(req._id)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                >
                                                    {t("friends.Accept")}
                                                </button>



                                                <button
                                                    onClick={() => rejectRequest(req._id)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                >
                                                    {t("friends.Reject")}
                                                </button>


                                            </div>


                                        </div>

                                    ))
                                }

                            </div>

                        )
                    }

                </section>






                {/* USERS */}

                <section className="bg-white rounded-xl shadow p-6">


                    <h2 className="text-2xl font-semibold mb-5">
                        {t("friends.FindPeople")}
                    </h2>



                    <div className="grid md:grid-cols-2 gap-5">


                        {
                            users.map((person: any) => (

                                <div
                                    key={person._id}
                                    className="border rounded-xl p-5 flex justify-between items-center hover:shadow-lg transition
                  "
                                >


                                    <div>

                                        <h3 className="font-semibold">
                                            {person.name}
                                        </h3>

                                        <p className="text-gray-500 text-sm">
                                            {person.email}
                                        </p>

                                    </div>



                                    <button

                                        disabled={
                                            sentRequests.includes(person._id) ||
                                            friendIds.includes(person._id)
                                        }

                                        onClick={() => sendRequest(person._id)}

                                        className={`px-4 py-2 rounded-lg text-white ${sentRequests.includes(person._id)
                                            ?
                                            "bg-gray-400"
                                            :
                                            friendIds.includes(person._id)
                                                ?
                                                "bg-green-500"
                                                :
                                                "bg-blue-600 hover:bg-blue-700"
                                            }

                                        `}

                                    >

                                        {
                                            friendIds.includes(person._id)
                                                ?
                                                t("friends.Friends")
                                                :
                                                sentRequests.includes(person._id)
                                                    ?
                                                    t("friends.Requested")
                                                    :
                                                    t("friends.Send")
                                        }

                                    </button>


                                </div>

                            ))
                        }


                    </div>


                </section>



            </div>

        </div>

    );

}