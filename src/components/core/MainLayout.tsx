// src/components/MainLayout.tsx
import React from 'react';
import { Outlet, useNavigate} from 'react-router-dom';
import { RoutePath } from '../../enums/RoutePath';
import { CircleUser, PersonStanding, Shirt } from 'lucide-react';
import DockItem from './DockItem';

const MainLayout: React.FC = () => {
    const navigate = useNavigate();

    const goToPage = (path: RoutePath) => {
        navigate(path);
    }

    return (
        <div className="app-container">
            <div className="content">
                <Outlet />
            </div>

            <div className="dock">
                <DockItem label='Avatars' path={RoutePath.HOME} icon={PersonStanding} action={() => goToPage(RoutePath.HOME)} />
                <DockItem label='Clothes' path={RoutePath.CLOTHES_LIST} icon={Shirt} action={() => goToPage(RoutePath.CLOTHES_LIST)} />
                <DockItem label='Profile' path={RoutePath.PROFILE} icon={CircleUser} action={() => goToPage(RoutePath.PROFILE)} />
            </div>
        </div>
    );
};

export default MainLayout;
