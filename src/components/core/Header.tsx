import type { ReactNode } from "react";

interface HeaderProps {
    children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
    return (
        <div className="h-20 bg-white mb-4 -m-4 px-4  shadow-lg flex flex-row items-center justify-center relative">
            {children}
        </div>
    )
}

export default Header;