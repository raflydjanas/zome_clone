"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCart from "./cart/MeetingCart";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { toast, useToast } from "./ui/use-toast";
import Loader from "./Loader/Loader";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const { push } = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, loading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcoming":
        return upcomingCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []);
        const callDataRecord = callData.filter((call) => call.recordings.length > 0).flatMap((call) => call.recordings);

        setRecordings(callDataRecord);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error fetching recordings",
        });
      }
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [callRecordings, toast, type]);

  if (loading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls?.length > 0 ? (
        calls?.map((meeting: Call | CallRecording) => {
          {
            console.log(meeting);
          }
          return (
            <MeetingCart
              key={(meeting as Call).id}
              icon={type === "ended" ? "/icons/previous.svg" : type === "upcoming" ? "/icons/upcoming.svg" : "/icons/recordings.svg"}
              title={(meeting as Call).state?.custom?.description || (meeting as CallRecording).filename?.substring(0, 20) || "Personal Meeting"}
              date={(meeting as Call).state?.startsAt?.toLocaleString() || (meeting as CallRecording).start_time?.toLocaleString()}
              previousMeeting={type === "ended"}
              link={type === "recordings" ? (meeting as CallRecording).url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`}
              buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
              buttonText={type === "recordings" ? "Play" : "Start"}
              handleClick={type === "recordings" ? () => push(`${(meeting as CallRecording).url}`) : () => push(`/meeting/${(meeting as Call).id}`)}
            />
          );
        })
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
