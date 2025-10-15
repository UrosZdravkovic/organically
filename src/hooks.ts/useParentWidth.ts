import { useRef, useState, useEffect } from 'react';

export function useParentWidth<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            if (ref.current) {
                setWidth(ref.current.offsetWidth);
            }
        }

        updateWidth();

        window.addEventListener("resize", updateWidth);

        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    return { ref, width };
}