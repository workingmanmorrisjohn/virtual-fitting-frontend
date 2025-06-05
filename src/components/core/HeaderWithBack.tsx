import Header from "../core/Header";
import type { ReactNode } from "react";

interface HeaderWithBackProps {
    handleBackClick: () => void
    children?: ReactNode
}

const HeaderWithBack: React.FC<HeaderWithBackProps> = ({ handleBackClick, children }) => {
    return (
        <Header>
            <button
                className="mr-2 flex items-center space-x-2" // Ensures space between icon and text
                onClick={handleBackClick} // This will take the user back to the previous page
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                <span className="text-md">back</span> {/* The text inside the button */}
            </button>
            {children}
        </Header>
    )
}

export default HeaderWithBack;