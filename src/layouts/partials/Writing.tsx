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
                <a href="https://www.fontspace.com/category/handwriting">
                    <img src="https://see.fontimg.com/api/rf5/14M2/NjNkOGVlNzVmYjdjNGVhYWI0MWFmY2YxODM3OTU3ZDMudHRm/QSB2aWRhIMOpIHVtYSBlc3RyYWRhICAgYSBtb3RvIMOpIGEgbGliZXJkYWRlICAgZSBvIHZlbnRvIG5vIHJvc3RvIMOpIGEgZmVsaWNpZGFkZQ/great-day-personal-use.png?r=fs&h=39&w=1000&fg=000000&bg=FFFFFF&tb=1&s=39" alt="Handwriting fonts" />
                </a>
                :
                <a href="https://www.fontspace.com/category/handwriting">
                    <img src="https://see.fontimg.com/api/rf5/14M2/NjNkOGVlNzVmYjdjNGVhYWI0MWFmY2YxODM3OTU3ZDMudHRm/QSB2aWRhIMOpIHVtYSBlc3RyYWRhICAgYSBtb3RvIMOpIGEgbGliZXJkYWRlICAgZSBvIHZlbnRvIG5vIHJvc3RvIMOpIGEgZmVsaWNpZGFkZQ/great-day-personal-use.png?r=fs&h=39&w=1000&fg=FFFBFB&bg=FFFFFF&tb=1&s=39" alt="Handwriting fonts" />
                </a>
            }
        </div>
    );
}