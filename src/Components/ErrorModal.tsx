import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ErrorModalProps {
    errorMessage: string;
    show: boolean;
    setShow: (show: boolean) => void;
    showClose: boolean;
}


const ErrorModal: React.FC<ErrorModalProps> = ({ errorMessage, show, setShow, showClose }) => {
    const handleClose = () => setShow(false);
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop={showClose ? true : "static"}
            keyboard={false}
        >
            <Modal.Header>
                <Modal.Title>エラーが発生しました</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessage}
            </Modal.Body>
            {showClose && (
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        閉じる
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default ErrorModal;