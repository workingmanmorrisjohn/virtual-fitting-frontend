import { useLocation } from 'react-router-dom';
import { RoutePath } from '../../enums/RoutePath';
import type { LucideProps } from 'lucide-react';

interface DockItemProps {
    label: string
    path: RoutePath
    icon: React.FC<LucideProps>
    action: () => void
}

const DockItem = (props: DockItemProps) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <button className={isActive(props.path) ? "dock-active" : ""} onClick={props.action}>
                <props.icon />
                <span className="dock-label">{props.label}</span>
            </button>
        </>
    )
}

export default DockItem;