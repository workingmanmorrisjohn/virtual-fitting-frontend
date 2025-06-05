import type { ReactNode } from "react";

interface BlockProps {
    children?: ReactNode;
}

const Block: React.FC<BlockProps> = ({ children }) => {
    return (
        <div className="w-full flex items-center justify-center">
            {children}
        </div>
    )
}

export default Block;