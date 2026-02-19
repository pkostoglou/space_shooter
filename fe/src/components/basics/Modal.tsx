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
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]">
            <div ref={modalContentRef}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
