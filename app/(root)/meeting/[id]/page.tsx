"use client";

import Loader from "@/components/Loader/Loader";
import MeetingRoom from "@/components/meetingList/MeetingRoom";
import MeetingSetup from "@/components/meetingList/MeetingSetup";
import { useCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState } from "react";

const MeetingPage = ({ params: { id } }: { params: { id: string } }) => {
  const { user, isLoaded } = useUser();
  const [setupCompleted, setSetupCompleted] = useState(false);
  const { call, callLoading } = useCallById(id);

  if (!isLoaded || callLoading) return <Loader />;

  return (
    <StreamCall call={call}>
      <StreamTheme>{!setupCompleted ? <MeetingSetup setSetupCompleted={setSetupCompleted} /> : <MeetingRoom />}</StreamTheme>
    </StreamCall>
  );
};

export default MeetingPage;
