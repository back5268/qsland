import React from 'react';
import MenuSidebar from './MenuSidebar';
import { MenuProvider } from './context/menucontext';
import { useSelector } from 'react-redux';

const AppSidebar = () => {
    const permissionCate = useSelector(state => state.permission).permissionCate;
    const model = [{ items: permissionCate ? permissionCate : []}];
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <MenuSidebar item={item} root={true} index={i} key={i} />
                        : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );

};

export default AppSidebar;
