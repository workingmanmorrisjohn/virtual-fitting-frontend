enum RoutePath {
    HOME = "/",
    LOGIN = "/log-in",
    RESET_PASS ="/reset-pass",
    ADD = "/add",
    ADD_AVATAR = "/add-avatar",
    AVATAR_INFO = "/avatar-info/:id",
    AVATAR_INFO_BASE = "/avatar-info", 
    CLOTHES_INFO = "/clothes-info/:id",
    CLOTHES_INFO_BASE = "/clothes-info",
    CLOTHES_LIST = "/clothes",
    PROFILE = "/profile",
    FITTING_ROOM = "/fitting-room/:id",
    FITTING_ROOM_BASE = "/fitting-room"
}

export {RoutePath};