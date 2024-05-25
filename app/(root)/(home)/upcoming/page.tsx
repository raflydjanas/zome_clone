import CallList from "@/components/CallList";
import React from "react";

const UpcomingPage = () => {
  return (
    <main className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-2xl font-bold">Upcoming</h1>
      <CallList type="upcoming" />
    </main>
  );
};

export default UpcomingPage;
