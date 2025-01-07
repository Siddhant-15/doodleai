"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  const { toast } = useToast();

  const onCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan, amount, credits, buyerId }),
      });

      const { orderId, amount: orderAmount } = await response.json();

      // Load Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderAmount,
        currency: "INR",
        name: "Imaginify",
        description: `Purchase ${plan}`,
        order_id: orderId,
        handler: async (response: any) => {
          toast({
            title: "Payment Successful!",
            description: "Credits have been added to your account.",
            duration: 5000,
            className: "success-toast",
          });

          // Call your backend to verify payment and update credits
          await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment failed. Please try again.",
        duration: 5000,
        className: "error-toast",
      });
    }
  };

  return (
    <section>
      <Button
        onClick={onCheckout}
        className="w-full rounded-full bg-purple-gradient bg-cover"
      >
        Buy Credit
      </Button>
    </section>
  );
};

export default Checkout;
