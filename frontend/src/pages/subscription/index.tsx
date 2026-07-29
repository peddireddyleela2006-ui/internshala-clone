import Link from "next/link";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import { useEffect, useState } from "react";
interface Subscription {
  plan: string;
  applicationsAllowed: number;
  applicationsUsed: number;
  expiryDate: string;
}


export default function Subscription() {
  const user = useSelector(selectuser);
  const plans = [
    {
      name: "Free",
      price: "₹0/month",
      limit: "1 application/month",
      color: "border-gray-400",
    },
    {
      name: "Bronze",
      price: "₹100/month",
      limit: "3 applications/month",
      color: "border-yellow-500",
    },
    {
      name: "Silver",
      price: "₹300/month",
      limit: "5 applications/month",
      color: "border-gray-500",
    },
    {
      name: "Gold",
      price: "₹1000/month",
      limit: "Unlimited applications",
      color: "border-amber-500",
    },
  ];
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };
  const handlePayment = async (amount: number) => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Unable to load Razorpay");
      return;
    }

    const response = await fetch(
      "https://internshala-clone-zril.onrender.com/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      }
    );


    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }
    const options = {
      key: "rzp_test_TINxzUdH8DEjaJ", // Replace with your Test Key ID
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Internera",
      description: "Subscription Plan",
      order_id: data.order.id,

      handler: async function (response: any) {
        try {
          const plan =
            amount === 100
              ? "Bronze"
              : amount === 300
                ? "Silver"
                : "Gold";

          // const verifyResponse = await fetch(
          //   "https://internshala-clone-zril.onrender.com/api/payment/verify-payment",
          //   {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({
          //       razorpay_order_id: response.razorpay_order_id,
          //       razorpay_payment_id: response.razorpay_payment_id,
          //       razorpay_signature: response.razorpay_signature,
          //       userId: mongouser._id,
          //       plan,
          //     }),
          //   }
          // );
          const userResponse = await fetch(
            `https://internshala-clone-zril.onrender.com/api/user/email/${encodeURIComponent(user.email)}`
          );

          const userData = await userResponse.json();

          const mongoUser = userData.user;

          const verifyResponse = await fetch(
            "https://internshala-clone-zril.onrender.com/api/payment/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: mongoUser._id,
                plan,
              }),
            }
          );

          const result = await verifyResponse.json();

          console.log(result);


          if (result.success) {
            alert("Subscription activated successfully!");
            window.location.reload();
          } else {
            alert(result.message);
          }
        } catch (err) {
          console.error("FULL ERROR:", err);

          // if (err.response) {
          //   console.log("Response:", err.response.data);
          // }

          alert("Payment verification failed.");
        }
      },

      theme: {
        color: "#2563eb",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);

    paymentObject.open();
  };
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.email) return;

      const userResponse = await fetch(
        `https://internshala-clone-zril.onrender.com/api/user/email/${encodeURIComponent(
          user.email
        )}`
      );

      const userData = await userResponse.json();

      if (!userData.success) return;

      const mongoUser = userData.user;

      const response = await fetch(
        `https://internshala-clone-zril.onrender.com/api/subscription/${mongoUser._id}`
      );

      const data = await response.json();

      if (data.success) {
        setSubscription(data.subscription);
      }
    };

    fetchSubscription();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Select the subscription that fits your internship application needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {plans.map((plan) => {
            const isCurrent = subscription?.plan === plan.name;
            return (

              <div
                key={plan.name}
                className={`relative rounded-3xl border ${plan.color} bg-white p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col`}
              >

                {/* Recommended Badge */}
                {plan.name === "Silver" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full font-semibold shadow">
                    MOST POPULAR
                  </span>
                )}

                {/* Plan Name */}
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  {plan.name}
                </h2>

                {/* Price */}
                <div className="text-center mt-6">
                  <span className="text-5xl font-extrabold text-blue-600">
                    {plan.price.replace("/month", "")}
                  </span>

                  <p className="text-gray-500 mt-1">per month</p>
                </div>

                {/* Divider */}
                <div className="border-t my-6"></div>

                {/* Features */}
                <ul className="space-y-4 text-gray-700 flex-1">
                  <li>✓ {plan.limit}</li>
                  <li>✓ Resume Builder</li>
                  <li>✓ Application Tracking</li>
                  <li>
                    ✓ {plan.name === "Gold"
                      ? "Priority Support"
                      : "Email Support"}
                  </li>
                </ul>

                {/* Button */}
                <button
                  onClick={() => {
                    if (plan.name === "Bronze") handlePayment(100);
                    if (plan.name === "Silver") handlePayment(300);
                    if (plan.name === "Gold") handlePayment(1000);
                  }}
                  disabled={isCurrent}
                  className={isCurrent ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}>
                  {isCurrent ? "Current Plan" : "Choose Plan"}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}