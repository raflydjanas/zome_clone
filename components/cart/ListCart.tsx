import React from "react";
import HomeCard from "./HomeCard";

type Props = {
  setMeetingState: (state: "scheduleMeeting" | "joinMeeting" | "instantMeeting" | undefined) => void;
  push: (path: string) => void;
};

const ListCart = ({ setMeetingState, push }: Props) => {
  return (
    <>
      <HomeCard title="New Meeting" img="/icons/add-meeting.svg" description="start an instan meeting" className="bg-orange-1" handleClick={() => setMeetingState("instantMeeting")} />

      <HomeCard title="Schedule Meeting" img="/icons/schedule.svg" description="Plan your meeting" className="bg-blue-1" handleClick={() => setMeetingState("scheduleMeeting")} />

      <HomeCard title="Recordings" img="/icons/recordings.svg" description="Check out your recordings" className="bg-purple-1" handleClick={() => push("/recordings")} />

      <HomeCard title="Join Meeting" img="/icons/join-meeting.svg" description="Join a meeting via invitation" className="bg-yellow-1" handleClick={() => setMeetingState("joinMeeting")} />
    </>
  );
};

export default ListCart;
