import React, {Fragment} from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {publicRoutes, errorPage, accessDeniedPage} from '@/routes';
import {PrivateRoutes, PublicRoutes} from '@/routes/PrivateRoute';
import Layout from '@/layout';
import {useSelector} from 'react-redux';
import Loading from "./auth/screen/Loading";

const Main = () => {
    const permissionTool = useSelector(state => state.permission).permissionTool;
    const loading = useSelector((state) => state.loading)
    return (
        <Router>
            {loading ? (
                <Loading loading={loading}/>
            ) : (
                <>
                    <div className="App">
                        <Routes>
                            {
                                publicRoutes.map((route, index) => {
                                    const DefaultLayout = route.layout === null ? Fragment : Layout;
                                    const Page = route.component;
                                    if (route.public) return <Route key={index} element={<PublicRoutes/>}>
                                        <Route path={route.path} element={<DefaultLayout><Page/></DefaultLayout>}/>
                                    </Route>
                                    return (permissionTool.includes(route.path.indexOf('/:id') ? route.path.replace("/:id", "") : route.path)
                                        || (route.path === '/') || (route.path === '/auth/changepassword') || (route.path === '/import_failed'))
                                        ? <Route key={index} element={<PrivateRoutes/>}>
                                            <Route path={route.path} element={<DefaultLayout><Page/></DefaultLayout>}/>
                                        </Route>
                                        : <Route key={index} path={route.path} element={<accessDeniedPage.component/>}/>
                                })
                            }
                            <Route path={errorPage.path} element={<errorPage.component/>}/>
                        </Routes>
                    </div>
                </>
            )}

        </Router>
    )
}

export default Main;