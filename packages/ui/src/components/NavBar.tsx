import React from 'react'
import { Button } from './button'

interface Link {
    name: string,
    href: string
}

interface NavBarProps {
    links: Link[],
    children: React.ReactNode
}

export const NavBar: React.FC<NavBarProps> = ({ links, children }) => {

    const reactLinks = links.map(link => {
        <Button asChild>
            {link.name}
        </Button>
    })

    return (
        <nav>

        </nav>
    )
}
