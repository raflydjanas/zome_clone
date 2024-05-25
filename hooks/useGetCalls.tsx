import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCalls = async () => {
      if (!user?.id || !client) return;
      setLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [{ created_by_user_id: user.id }, { members: { $in: [user.id] } }],
          },
        });
        setCall(calls);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getCalls();
  }, [user?.id, client]);

  const now = new Date();

  const endedCalls = call?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  const upcomingCalls = call?.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });

  return { endedCalls, upcomingCalls, callRecordings: call, loading };
};
