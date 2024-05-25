"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MeetingModal from "../cart/modal/MeetingModal";
import ListCart from "../cart/ListCart";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "../ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import ReactDatePicker from "react-datepicker";

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
  const [callDetails, setCallDetails] = useState<Call>();

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

      {callDetails ? (
        <MeetingModal
          isOpen={meetingState === "scheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(callDetails.id);
            toast({ title: "✅ link copied" });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      ) : (
        <MeetingModal isOpen={meetingState === "scheduleMeeting"} onClose={() => setMeetingState(undefined)} title="Create Meeting" handleClick={createMeeting}>
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">Add a descriptions</label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">Select a date and time</label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none text-white"
            />
          </div>
        </MeetingModal>
      )}

      <MeetingModal
        isOpen={meetingState === "instantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="start meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === "joinMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="join meeting"
        handleClick={() => push(values.link)}
      >
        <input type="text" className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 py-2 px-3 text-white" onChange={(e) => setValues({...values, link: e.target.value})}/>
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
