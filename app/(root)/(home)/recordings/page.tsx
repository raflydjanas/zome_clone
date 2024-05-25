import CallList from "@/components/CallList";
import React from "react";

const RecordingsPage = () => {
  return (
    <main className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-2xl font-bold">Recordings</h1>
      <CallList type="recordings" />
    </main>
  );
};

export default RecordingsPage;
