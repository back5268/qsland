import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export const PrivateRoutes = () => {
    const userInfo = useSelector((state) => state.userInfo)
    return userInfo ? <Outlet /> : <Navigate to="/auth/login" />
}

export const PublicRoutes = () => {
    const userInfo = useSelector((state) => state.userInfo)
    return !userInfo ? <Outlet /> : <Navigate to="/" />
}