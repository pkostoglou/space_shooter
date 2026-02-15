import { ReactNode } from "react";

const Modal = ({
    isOpen,
    children
}: {
    isOpen: boolean;
    children: ReactNode
}) => {

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
            {children}
        </div>
    );
};

export default Modal;