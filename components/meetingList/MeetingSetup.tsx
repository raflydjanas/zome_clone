"use client";
import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const MeetingSetup = ({ setSetupCompleted }: { setSetupCompleted: (value: boolean) => void }) => {
  const [micCamToggleOn, setMicCamToggleOn] = useState(false);
  const call = useCall();

  if (!call) throw new Error("useCall must be used within streamCall component");

  useEffect(() => {
    if (micCamToggleOn) {
      call?.microphone.disable();
      call?.camera.disable();
    } else {
      call?.microphone.enable();
      call?.camera.enable();
    }
  }, [micCamToggleOn, call?.camera, call?.microphone]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Setup Cam and Mic</h1>
        <VideoPreview />
        <div className="flex h-16 items-center justify-center gap-3">
          <label htmlFor="micCamToggle" className="flex items-center gap-2 font-medium text-white">
            <input type="checkbox" checked={micCamToggleOn} onChange={(e) => setMicCamToggleOn(e.target.checked)} />
            join with audio and camera
          </label>
          <DeviceSettings />
        </div>
        <Button
          className="rounded-md bg-green-500 px-4 py-2.5"
          onClick={() => {
            call?.join();
            setSetupCompleted(true);
          }}
        >
          Join Meeting
        </Button>
      </div>
    </div>
  );
};

export default MeetingSetup;
