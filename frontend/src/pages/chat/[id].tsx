import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";

const API = "https://internshala-clone-zril.onrender.com/api";

export default function Chat() {
    const router = useRouter();
    const user = useSelector(selectuser);

    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const { id } = router.query;
    const friendId = typeof id === "string" ? id : "";

    const loadMessages = async () => {
        try {
            const res = await axios.get(
                `${API}/chat/${user._id}/${friendId}`
            );

            setMessages(res.data.chats);
        } catch (err) {
            console.log(err);
        }
    };
    const sendMessage = async () => {

    if (!message.trim()) return;

    console.log({
        senderId: user?._id,
        receiverId: friendId,
        message: message,
    });

    try {

        await axios.post(
            `${API}/chat/send`,
            {
                senderId: user._id,
                receiverId: friendId,
                message: message,
            }
        );

        setMessage("");
        loadMessages();

    } catch (err) {
        console.log(err);
    }
};
    useEffect(() => {
        if (router.isReady && user?._id && friendId) {
            loadMessages();
        }
    }, [router.isReady, user?._id, friendId]);

    if (!router.isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl">
                Loading...
            </div>
        );
    }
    console.log("Router query:", router.query);
    console.log("Friend ID:", friendId);
    return (
        <div className="min-h-screen bg-gray-100 p-6 text-black">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg">

                {/* Header */}
                <div className="border-b p-5">
                    <h1 className="text-2xl font-bold">Chat</h1>

                    <p className="text-gray-500 mt-2">
                        Friend ID: {friendId}
                    </p>
                </div>

                {/* Messages */}
                <div className="h-[500px] overflow-y-auto p-5 bg-gray-50">
                    {messages.length === 0 ? (
                        <p className="text-center text-gray-400 mt-20">
                            No messages yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((msg: any) => (
                                <div
                                    key={msg._id}
                                    className={`flex ${msg.sender._id === user._id
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-xl ${msg.sender._id === user._id
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-300 text-black"
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="border-t p-4 flex gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-lg px-4 py-2 outline-none"
                    />

                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
                    >
                        Send
                    </button>
                </div>

            </div>
        </div>
    );
}