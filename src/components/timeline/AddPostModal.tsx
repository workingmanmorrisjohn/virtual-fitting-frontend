import { ModalNames } from "../../enums/ModalNames";
import { Send, Trash2Icon } from "lucide-react";
import { useAddPost, useUpdatePostWithImage, useUpdatePostWithNoImage } from "../../hooks/usePosts";
import type { AddPostParams, UpdatePostWithImageParams, UpdatePostWithNoImageParams } from "../../types/Post";
import { usePost } from "../../context/PostContext";
import { useState } from "react";
import { closeModal, resizeImage } from "../../utils/UtilityFunctions";

const AddPostModal = () => {
  const {id, title, setTitle, text, setText, image, setImage, imagePreview, setImagePreview, uploadedSuccessfully, previousImage} = usePost();
  
  const addPost = useAddPost();
  const updatePostWithImage = useUpdatePostWithImage();
  const updatePostWithNoImage = useUpdatePostWithNoImage();

  const [submittingPost, setSubmittingPost] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handlePublishPost = async () => {
    if (id == "") {
      await handlePublishNewPost();
    } else {
      await handlePublishUpdatedPost();
    }
  }

  const handlePublishUpdatedPost = async () => {
    if (previousImage == imagePreview) {
      const updatedPost: UpdatePostWithNoImageParams = {
        id: id,
        title: title,
        text: text
      };

      try {
        setSubmittingPost(true);
        await updatePostWithNoImage.mutateAsync(updatedPost);
        setSubmittingPost(false);
        uploadedSuccessfully();
        closeModal(ModalNames.ADD_POST);
      } catch (err) {
        console.error("Failed to publish post:", err);
      }
    } else {
      var toUploadImage: File | null = image;

      if (image) {
        const resizedBlob = await resizeImage(image, 1000, 1000); // max 300x300 px
        toUploadImage = new File([resizedBlob], image.name, { type: image.type });
      }
      

      const updatedPost: UpdatePostWithImageParams = {
        id: id,
        title: title,
        text: text,
        image: toUploadImage
      };

      try {
        setSubmittingPost(true);
        await updatePostWithImage.mutateAsync(updatedPost);
        setSubmittingPost(false);
        uploadedSuccessfully();
        closeModal(ModalNames.ADD_POST);
      } catch (err) {
        console.error("Failed to publish post:", err);
      }
    }
  }

  const handlePublishNewPost = async () => {
    const newPost: AddPostParams = {
      title,
      text,
      image
    };

    try {
      setSubmittingPost(true);
      await addPost.mutateAsync(newPost);
      setSubmittingPost(false);
      uploadedSuccessfully();
      closeModal(ModalNames.ADD_POST);
    } catch (err) {
      console.error("Failed to publish post:", err);
    }
  };

  return (
    <>
      <dialog id={ModalNames.ADD_POST} className="modal backdrop-blur-sm">
        <div className="modal-box max-w-2xl shadow-2xl border border-base-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
            <h3 className="text-2xl font-bold text-base-content">
              Create New Post
            </h3>
            <div className="badge badge-outline">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          <form method="dialog" className="space-y-6">
            {/* Title Input */}
            <div className="form-control">
              <input
                type="text"
                placeholder="Enter your post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input w-full border-0 bg-base-100 font-semibold"
                maxLength={100}
              />
              <label className="label">
                <span className="label-text-alt text-xs opacity-60 pl-2">{title.length}/100</span>
              </label>
            </div>

            {/* Text Area */}
            <div className="form-control">
              <textarea
                placeholder="What's on your mind? Share your thoughts..."
                className="textarea w-full h-52 resize-none border-0 bg-base-100"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={280}
              />
              <label className="label">
                <span className="label-text-alt text-xs opacity-60 pl-2">{text.length}/280</span>
              </label>
            </div>

            {/* Image Upload Section */}
            <div className="form-control">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-80 object-cover rounded-xl shadow-lg border-2 border-base-300"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="btn btn-circle btn-sm shadow-lg bg-base-content text-base-100 hover:bg-base-content/80"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="relative">
                  <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-base-300 rounded-xl hover:border-base-content/30 hover:bg-base-200/50 cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="text-sm text-base-content/70 font-medium">
                        <span className="text-base-content">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-base-content/50 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Action Buttons */}
            <div className="modal-action pt-6 border-t border-base-300">
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm flex-1 sm:flex-none hover:bg-base-300"
                  onClick={() => {
                    setTitle("");
                    setText("");
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  <Trash2Icon className="text-red-500" strokeWidth={2} size={15} />
                </button>
                <button
                  type="button"
                  className="btn btn-sm flex-1 sm:flex-none shadow-lg bg-base-content text-base-100 hover:bg-base-content/80 border-0"
                  disabled={!title.trim() || !text.trim() || submittingPost}
                  onClick={handlePublishPost}
                >
                  {
                    !submittingPost ?
                    <>
                      <Send size={15} />
                      Publish Post
                    </> : <span className="loading loading-spinner loading-md"></span>
                    
                  }
                  
                </button>
              </div>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop bg-black/20 backdrop-blur-sm">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default AddPostModal;