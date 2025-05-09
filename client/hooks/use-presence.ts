import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/lib/entities";

const supabase = createClient();

export function usePresence(teamId: string, currentUser: User | null) {
  const queryClient = useQueryClient();
  const CHANNEL = `team-${teamId}`;

  const [onlineIds, setOnlineIds] = useState<string[]>([]);

  useEffect(() => {
    if (!teamId || !currentUser?.id) return;

    const channel = supabase.channel(CHANNEL, {
      config: { presence: { key: currentUser.id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const onlineIds = Object.keys(state);
        setOnlineIds(onlineIds);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id: currentUser.id,
            name: currentUser.name,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [teamId, currentUser?.id, currentUser?.name, queryClient, CHANNEL]);

  return onlineIds;
}
