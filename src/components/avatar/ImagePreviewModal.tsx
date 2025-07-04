import { ModalNames } from "../../enums/ModalNames";

interface ImagePreviewModalProps {
  imgSrc: string;
}

const ImagePreviewModal = ({ imgSrc }: ImagePreviewModalProps) => {
  return (
    <dialog
      id={ModalNames.IMAGE_PREVIEW_MODAL}
      className="modal"
    >
      <div className="modal-box relative">
        {/* top-right close button */}
        <form method="dialog" className="absolute right-2 top-2">
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>

        <img
          src={imgSrc}
          alt="Preview"
          className="w-full h-[300px] object-contain rounded"
        />

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>

      {/* backdrop form to close when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ImagePreviewModal;
