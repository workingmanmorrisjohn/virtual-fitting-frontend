import type { ReactNode } from "react";

interface PageProps {
    children?: ReactNode;
}

const Page: React.FC<PageProps> = ({children }) => {
    return ( 
        <div className="relative bg-white overflow-auto h-[calc(100vh-4rem)] p-4">
            {children}
        </div>
    )
}

export default Page;