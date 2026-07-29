import Link from "next/link";
import { useRouter } from "next/router";
import {
    Home,
    GraduationCap,
    Briefcase,
    Users,
    Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";

export default function Sidebar() {
    const router = useRouter();
    const { t } = useTranslation();

    const menu = [
        {
            title: "Home",
            href: "/",
            icon: Home,
        },
        {
            title: t("navbar.internships"),
            href: "/internship",
            icon: GraduationCap,
        },
        {
            title: t("navbar.jobs"),
            href: "/job",
            icon: Briefcase,
        },
        {
            title: t("navbar.friends"),
            href: "/friends",
            icon: Users,
        },
        {
            title: t("navbar.publicspace"),
            href: "/publicspace",
            icon: Globe,
        },
    ];

    const user = useSelector(selectuser);


    const [subscription, setSubscription] = useState({
        plan: "Free",
        remaining: 1,
        limit: 1,
    });
    useEffect(() => {

        const fetchSubscription = async () => {

            if (!user?.email) return;


            try {

                const userResponse = await fetch(
                    `https://internshala-clone-zril.onrender.com/api/user/email/${encodeURIComponent(user.email)}`
                );


                const userData = await userResponse.json();


                if (!userData.success) return;


                const mongoUser = userData.user;


                const response = await fetch(
                    `https://internshala-clone-zril.onrender.com/api/subscription/${mongoUser._id}`
                );


                const data = await response.json();


                if (data.success && data.subscription) {

                    const sub = data.subscription;


                    setSubscription({

                        plan: sub.plan,

                        remaining:
                            sub.applicationsAllowed -
                            sub.applicationsUsed,

                        limit:
                            sub.applicationsAllowed

                    });

                }


            } catch (error) {

                console.log(
                    "Subscription fetch error:",
                    error
                );

            }

        };


        fetchSubscription();


    }, [user]);
    const planName = subscription.plan;

    const applicationsRemaining = subscription.remaining;

    const usagePercentage =
        subscription.plan === "Gold"
            ? 0
            : ((subscription.limit - subscription.remaining) /
                subscription.limit) * 100;
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm z-50">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                <img
                    src="/globe.svg"
                    alt="Internera"
                    className="w-11 h-11"
                />

                <div>
                    <h1 className="text-2xl font-bold text-blue-600">
                        Internera
                    </h1>

                    <p className="text-xl text-gray-500">
                        Find your dream internship
                    </p>
                </div>
            </Link>

            {/* Menu */}
            <div className="px-4 py-6 space-y-2">

                {menu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${router.pathname === item.href
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "text-gray-700 hover:bg-blue-50"
                                }`}
                        >
                            <Icon size={20} />
                            {item.title}
                        </Link>

                    );
                })}

                <LanguageSelector />
                {/* Subscription */}

                <div className="mt-8 rounded-xl border bg-slate-50 p-4">

                    <div className="flex items-center gap-2 mb-3">

                        <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                            💳
                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-800">
                                Subscription
                            </h3>

                            <p className="text-xs text-gray-500">
                                Current Plan
                            </p>

                        </div>

                    </div>

                    <div className="mb-3">

                        <p className="font-semibold text-blue-600">
                            {planName}
                        </p>

                        <p className="text-sm text-gray-600">
                            {applicationsRemaining} applications remaining
                        </p>

                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">

                        <div
                            className="h-full bg-blue-600"
                            style={{
                                width: `${usagePercentage}%`,
                            }}
                        />

                    </div>

                    <Link
                        href="/subscription"
                        className="mt-4 inline-flex text-blue-600 font-medium text-sm hover:underline"
                    >
                        Manage Subscription →
                    </Link>

                </div>
                <div className="pt-6">

                </div>

            </div>
        </aside>
    );
}