import React, {useContext, useState} from 'react'
import {Menu} from 'semantic-ui-react'
import {Link} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'

function MenuBar() {



    const pathname = window.location.pathname
    const path = pathname === '/' ? 'home' : pathname.substr(1)

    const [activeItem, setActiveItem] = useState(path)

    const handleItemClick = (e, {name}) => setActiveItem(name)

    return (
        <Menu size='massive' color='teal'>
            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
                as={Link}
                to='/'
            />
            <Menu.Item
                name='Dashboard'
                active={activeItem === 'Dashboard'}
                onClick={handleItemClick}
                as={Link}
                to='/dashboard'
            />
            <Menu.Item
                name='Search/Filter'
                active={activeItem === 'Search/Filter'}
                onClick={handleItemClick}
                as={Link}
                to='/search'
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    name='register'
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                    as={Link}
                    to='/register'
                />
            </Menu.Menu>
        </Menu>
    )
}

export default MenuBar
