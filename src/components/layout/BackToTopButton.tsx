"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePathname } from 'next/navigation';

export function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible || pathname?.includes('/client-form')) {
        return null;
    }

    return (
        <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-24 right-6 z-50 h-10 w-10 rounded-full bg-slate-900 text-white shadow-lg transition-all hover:bg-slate-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            aria-label="Back to top"
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    );
}
