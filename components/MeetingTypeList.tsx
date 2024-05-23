"use client";
import React, { useState } from "react";
import HomeCard from "./cart/HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./cart/modal/MeetingModal";

const MeetingTypeList = () => {
  const { push } = useRouter();
  const [meetingState, setMeetingState] = useState<"scheduleMeeting" | "joinMeeting" | "instantMeeting" | undefined>(undefined);

  const createMeeting = () => {
    alert("Meeting created");
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard title="New Meeting" img="/icons/add-meeting.svg" description="start an instan meeting" className="bg-orange-1" handleClick={() => setMeetingState("instantMeeting")} />

      <HomeCard title="Schedule Meeting" img="/icons/schedule.svg" description="Plan your meeting" className="bg-blue-1" handleClick={() => setMeetingState("scheduleMeeting")} />

      <HomeCard title="Recordings" img="/icons/recordings.svg" description="Check out your recordings" className="bg-purple-1" handleClick={() => push("/recordings")} />

      <HomeCard title="Join Meeting" img="/icons/join-meeting.svg" description="Join a meeting via invitation" className="bg-yellow-1" handleClick={() => setMeetingState("joinMeeting")} />

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
