import { Bone, CheckCircle, CircleX, HeartCrack, LoaderCircle, type LucideProps } from "lucide-react"
import { Status } from "../../enums/Status"

interface StatusectionProps {
    status: Status 
}

interface StatusMessage {
    header: string
    message: string
    icon: React.FC<LucideProps>
}

const StatusSection = ({status} : StatusectionProps) => {

    const getMessage = (status: string) : StatusMessage => {
        switch (status) {
            case Status.READY:
                return {header : "Processing Complete", message : "Your avatar is ready for fitting", icon: CheckCircle}
            
            case Status.MODELING:
                return {header : "Modeling Started", message : "Your request has been received! The system is currently creating your avatar.", icon: LoaderCircle }

            case Status.RIGGING:
                return {header : "Rigging Model", message : "Your avatar is created! Please wait for the rigging to complete before using the fitting room", icon: Bone}
            
            case Status.FAILED:
                return {header : "Failed", message : "Something went wrong when creating the avatar", icon: HeartCrack} 
            
            default:
                return {header : "Status Unavailable", message : "Cannot retrieve status, please refresh page.", icon: CircleX}
        }
    }

    const message = getMessage(status);

    return (
        <div className="bg-gray-100 rounded-2xl p-6 shadow-sm border border-gray-300">
            <div className="flex flex-row items-center justify-between">
                <div className="w-1/6 flex ">
                    <message.icon className="text-gray-700" size={24} />
                </div>
                
                <div className="w-5/6">
                    <p className="text-gray-900 font-semibold">{message.header}</p>
                    <p className="text-gray-700 text-sm">{message.message}</p>
                </div>
            </div>
        </div>
    )
}

export default StatusSection;