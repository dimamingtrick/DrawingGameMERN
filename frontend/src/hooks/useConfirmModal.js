import { useState } from "react";

const useConfirmModal = (deleteFunction, deleteFunctionCallBack) => {
  const [id, setId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingError, setDeletingError] = useState("");

  const toggleDeleteModal = () => {
    if (isOpen) {
      setDeletingError("");
      setIsDeleting(false);
      setDeletingError("");
    }
    setIsOpen(!isOpen);
  };

  const onDeleteConfirmed = () => {
    setIsDeleting(true);
    setDeletingError("");

    deleteFunction(id)
      .then(() => {
        setIsDeleting(false);
        setId(null);
        setIsOpen(false);
        deleteFunctionCallBack();
      })
      .catch(err => {
        setIsDeleting(false);
        setDeletingError(err);
      });
  };

  return [
    setId,
    isOpen,
    isDeleting,
    deletingError,
    toggleDeleteModal,
    onDeleteConfirmed,
  ];
};

export default useConfirmModal;
