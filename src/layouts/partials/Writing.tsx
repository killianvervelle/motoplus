"use client";

import React, { useState, useEffect } from 'react'
import { useTheme } from "next-themes";


export default function Writing() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div>
            {resolvedTheme == 'light' ?
                <a href="https://www.fontspace.com/category/calligraphy"><img src="https://see.fontimg.com/api/rf5/nAYpR/NGQyZmJkMjY1MzkzNDFkZGJlODExN2UyNTY0MzYxODkudHRm/QSB2aWRhIMOpIHVtYSBlc3RyYWRhLCBhIG1vdG8gw6kgbGliZXJkYWRlIGUgbyB2ZW50byBubyByb3N0byDDqSBmZWxpY2lkYWRlLg/zialothus-regular.png?r=fs&h=38&w=1250&fg=000000&bg=FFFFFF&tb=1&s=30" alt="Calligraphy fonts"/></a>
                :
                <a href="https://www.fontspace.com/category/calligraphy"><img src="https://see.fontimg.com/api/rf5/nAYpR/NGQyZmJkMjY1MzkzNDFkZGJlODExN2UyNTY0MzYxODkudHRm/QSB2aWRhIMOpIHVtYSBlc3RyYWRhLCBhIG1vdG8gw6kgbGliZXJkYWRlIGUgbyB2ZW50byBubyByb3N0byDDqSBmZWxpY2lkYWRlLg/zialothus-regular.png?r=fs&h=34&w=1250&fg=F5F3F3&bg=FFFFFF&tb=1&s=27" alt="Calligraphy fonts"/></a>            
            }
        </div>
    );
}