import { useQueryTeamUsers } from "@/hooks/use-query-team-users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const UserSelect = ({
  teamId,
  selectedUserId,
  setSelectedUserId,
}: {
  teamId: string;
  selectedUserId: string;
  setSelectedUserId: (userId: string) => void;
}) => {
  const { data: teamUsers } = useQueryTeamUsers(teamId);

  return (
    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {teamUsers?.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default UserSelect;
