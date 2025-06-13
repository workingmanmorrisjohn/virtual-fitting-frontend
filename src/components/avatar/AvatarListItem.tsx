import { useNavigate } from "react-router"
import type { Avatar } from "../../types/Avatar"
import { RoutePath } from "../../enums/RoutePath";
import { getFileURLFromAvatar } from "../../utils/UtilityFunctions";
import { ImageIcon } from "lucide-react";

interface AvatarListItemProps {
  avatar: Avatar
}

const AvatarListItem = ({ avatar }: AvatarListItemProps) => {
  const navigate = useNavigate();

  const front_view_image = getFileURLFromAvatar(avatar, avatar.front_view);
  const side_view_image = getFileURLFromAvatar(avatar, avatar.side_view);

  return (
    <div
      key={avatar.id}
      className="w-full rounded-lg shadow-lg border border-gray-200 bg-white p-4 hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => navigate(`${RoutePath.AVATAR_INFO_BASE}/${avatar.id}`)}
    >
      <div className="flex flex-row items-center gap-4">
        {/* Front view */}
        <div className="flex-shrink-0">
          <div className="w-18 h-24 bg-gray-100 rounded border border-gray-300 overflow-hidden">
            {front_view_image ? <img
              src={front_view_image}
              alt={`Avatar ${avatar.id}`}
              className="w-full h-full object-cover"
            /> :
              <div className="flex w-full h-full items-center justify-center">
                <ImageIcon />
              </div>}
          </div>
        </div>

        {/* Side view */}
        <div className="flex-shrink-0">
          <div className="w-18 h-24 bg-gray-50 rounded border border-gray-300 overflow-hidden">
            {side_view_image ? <img
              src={side_view_image}
              alt={`Avatar side ${avatar.id}`}
              className="w-full h-full object-cover"
            /> :
              <div className="flex w-full h-full items-center justify-center">
                <ImageIcon />
              </div>
            }
          </div>
        </div>

        {/* Metadata */}
        <div className="flex-1 ml-4">
          <div className="text-lg font-medium text-gray-800 mb-1">
            {avatar.id}
          </div>
          <div className="text-base text-gray-600">
            Status: {avatar.status}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvatarListItem;