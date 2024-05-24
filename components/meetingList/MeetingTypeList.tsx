"use client";
import React, { useState } from "react";
import HomeCard from "../cart/HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "../cart/modal/MeetingModal";
import ListCart from "../cart/ListCart";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "../ui/use-toast";

const MeetingTypeList = () => {
  const { push } = useRouter();
  const [meetingState, setMeetingState] = useState<"scheduleMeeting" | "joinMeeting" | "instantMeeting" | undefined>(undefined);

  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Call failed");

      const startAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startAt,
          custom: {
            description: description,
          },
        },
      });

      if (!values.description) {
        push(`/meeting/${call.id}`);
      }
      toast({ title: "✅ Meeting created" });
    } catch (error) {
      console.log(error);
      toast({ title: "❌ Meeting creation failed" });
    }
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <ListCart setMeetingState={setMeetingState} push={push} />

      <MeetingModal
        isOpen={meetingState === "instantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="start meeting"
        handleClick={createMeeting}
      ></MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
