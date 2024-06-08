import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="w-64 bg-base-200 text-base-content overflow-auto">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">ChatApp</a>
            </div>
            <ul className="menu p-4 w-full">
                <li><Link href="/Chat" className="hover:bg-base-300">Messages</Link></li>
                <li><Link href="/ViewProfile" className="hover:bg-base-300">View Profile</Link></li>
                <li><Link href="/Catalog" className="hover:bg-base-300">Catalog</Link></li>
                
            </ul>
        </div>
    );
};

export default Sidebar;