import { ReactNode, useRef, useEffect } from "react";

const Modal = ({
    isOpen,
    children,
    setIsOpen
}: {
    isOpen: boolean;
    children: ReactNode;
    setIsOpen?: (openStatus: boolean) => void;
}) => {

    const modalContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!setIsOpen) return
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                console.log("Should close")
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;


    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div ref={modalContentRef}>
                {children}
            </div>
        </div>
    );
};

export default Modal;