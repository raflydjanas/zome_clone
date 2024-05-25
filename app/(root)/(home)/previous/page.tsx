import CallList from "@/components/CallList";
import React from "react";

const PreviousPage = () => {
  return (
    <main className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-2xl font-bold">Previous</h1>
      <CallList type="ended" />
    </main>
  );
};

export default PreviousPage;
