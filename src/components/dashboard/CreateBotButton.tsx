"use client";

import { apiClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CreateBotButton = ({
  className,
  children,
  variant,
}: {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.post("/api/chatbots");
      if (data.success) {
        router.push(`/dashboard/bots/${data.bot._id}/config`);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={create} disabled={loading} className={className} variant={variant}>
      {children}
    </Button>
  );
};
