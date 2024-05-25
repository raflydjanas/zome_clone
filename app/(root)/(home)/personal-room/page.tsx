"use client";

import React, { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useCallById } from "@/hooks/useGetCallById";

const Table = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col items-start gap-2 xl:flex-row">
    <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">{title}:</h1>
    <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">{description}</h1>
  </div>
);

const PersonalRoomPage = () => {
  const { user } = useUser();
  const meetingId = user?.id;
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
  const { call } = useCallById(meetingId!);

  const createMeeting = async () => {
    if (!client || !user) return;

    if (!call) {
      const newCall = client.call("default", meetingId!);

      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    push(`/meeting/${meetingId}?personal=true`);
  };
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Personal Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.username}'s Meeting Topic`} />
        <Table title="Meeting ID" description={meetingId!} />
        <div className="flex gap-3 items-center">
          <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">Meeting Link:</h1>
          <div className="flex gap-3 bg-slate-700 py-2 px-4 rounded-md items-center ">
            <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-md">{meetingLink}</h1>
            <button
              type="button"
              className="border border-slate-00 text-white px-4 py-2 rounded-md"
              onClick={() => {
                navigator.clipboard.writeText(meetingLink);
                toast({ title: "✅ Meeting Copied" });
              }}
            >
              <IoCopyOutline />
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-5">
        <Button disabled={isLoading} className="bg-blue-1" onClick={createMeeting}>
          {isLoading ? "Loading..." : "Create Meeting"}
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoomPage;
