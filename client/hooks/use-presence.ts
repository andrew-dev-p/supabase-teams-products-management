import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/lib/entities";
import { QueryKey } from "@/lib/consts";

export function usePresence(teamId: string, currentUser: User | null) {
  const queryClient = useQueryClient();
  const CHANNEL = `team-${teamId}`;
  const supabase = createClient();

  useEffect(() => {
    if (!teamId || !currentUser?.id) return;

    const channel = supabase.channel(CHANNEL, {
      config: { presence: { key: currentUser.id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const onlineIds = Object.keys(state);

        queryClient.setQueryData(
          [QueryKey.GET_TEAM_USERS_BY_TEAM_ID, teamId],
          (prev: User[]) => {
            if (!prev) return prev;
            return prev.map((user) => ({
              ...user,
              is_online: onlineIds.includes(user.id),
            }));
          }
        );
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
  }, [teamId, currentUser, CHANNEL, queryClient, supabase]);
}
