import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PocketBaseProvider } from "./context/PocketBaseContext"
import { RoutePath } from './enums/RoutePath';
import MainLayout from './components/core/MainLayout';
import { PostProvider } from './context/PostContext';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './context/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import AvatarListPage from './pages/AvatarListPage';
import ClothesPage from './pages/ClothesPage';
import ProfilePage from './pages/ProfilePage';
import AddAvatarPage from './pages/AddAvatarPage';
import AvatarInfoPage from './pages/AvatarInfoPage';
import ClothesInfoPage from './pages/ClothesInfoPage';
import FittingRoomPage from './pages/FittingRoomPage';
import DataPrivacyPage from './pages/DataPrivacyPage';

const queryClient = new QueryClient();

function App() {

  return (
    <>
      <PocketBaseProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PrimeReactProvider>
              <PostProvider>
                <Router>
                  <Routes>
                    <Route element={<PrivateRoute />}>
                      <Route element={<MainLayout />}>
                        <Route path={RoutePath.HOME} element={<AvatarListPage />} />
                        <Route path={RoutePath.CLOTHES_LIST} element={<ClothesPage />} />
                        <Route path={RoutePath.PROFILE} element={<ProfilePage />} />
                      </Route>

                      <Route path={RoutePath.ADD_AVATAR} element={<AddAvatarPage />} />
                      <Route path={RoutePath.AVATAR_INFO} element={<AvatarInfoPage />} />
                      <Route path={RoutePath.CLOTHES_INFO} element={<ClothesInfoPage />} />
                      <Route path={RoutePath.FITTING_ROOM} element={<FittingRoomPage />} />
                      <Route path={RoutePath.DATA_PRIVACY} element={<DataPrivacyPage />} />

                    </Route>
                    <Route path={RoutePath.LOGIN} element={<LoginPage />} />
                  </Routes>
                </Router>
              </PostProvider>
            </PrimeReactProvider>
          </AuthProvider>
        </QueryClientProvider>
      </PocketBaseProvider>
    </>
  )
}

export default App
