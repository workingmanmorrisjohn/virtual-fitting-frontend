import { ModalNames } from "../../enums/ModalNames";
import { useAcceptedDataPrivacy } from "../../hooks/useDataPrivacy";
import { useAuth } from "../../context/AuthContext";
import { closeModal } from "../../utils/UtilityFunctions";
import { useEffect } from "react";

const DataPrivacyAcceptanceModal = () => {
    const { accepted, loading, actionLoading, error, addAcceptance } = useAcceptedDataPrivacy();
    const {logout} = useAuth();

    useEffect(() => {
        if (!loading && accepted === false) {
            const modal = document.getElementById(ModalNames.DATA_PRIVACY_ACCEPTANCE) as HTMLDialogElement;
            modal?.showModal();
        }
    }, [loading, accepted]);



    const handleAccept = async () => {
        const success = await addAcceptance();
        if (success) {
            closeModal(ModalNames.DATA_PRIVACY_ACCEPTANCE);
        }
    };

    const handleDecline = () => {
        logout();
    };

    if (loading) {
        return null; // Don't render anything while checking status
    }

    return (
        <>
            <dialog
                id={ModalNames.DATA_PRIVACY_ACCEPTANCE}
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Privacy & Data Use Policy</h3>

                    <div className="prose max-w-none">
                        <p className="text-sm text-gray-600 mb-4">
                            Welcome to Snap2Fit! We respect your privacy and want you to understand how we collect, use, and protect your information.
                        </p>

                        <div className="bg-base-200 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">What We Collect</h4>
                            <p className="text-sm mb-2">To provide you with accurate size recommendations, we collect:</p>
                            <ul className="text-sm space-y-1">
                                <li>• A front-facing photo</li>
                                <li>• A side-view photo</li>
                                <li>• A back-view photo</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">These images are processed to generate a 3D body model for virtual clothing fitting.</p>
                        </div>

                        <div className="bg-base-200 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">How We Use Your Photos</h4>
                            <ul className="text-sm space-y-1">
                                <li>• To analyze body proportions</li>
                                <li>• To generate a personalized 3D model</li>
                                <li>• To recommend clothing sizes accurately</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">We do not use your images for any other purpose (e.g., marketing or advertising) without your consent.</p>
                        </div>

                        <div className="bg-base-200 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">Data Retention Policy</h4>
                            <p className="text-sm mb-2">Your uploaded photos are:</p>
                            <ul className="text-sm space-y-1">
                                <li>• Stored securely</li>
                                <li>• Automatically deleted after 30 days</li>
                                <li>• Can be manually deleted at any time upon your request</li>
                            </ul>
                        </div>

                        <div className="bg-base-200 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">Your Rights</h4>
                            <p className="text-sm mb-2">You have the right to:</p>
                            <ul className="text-sm space-y-1">
                                <li>• Access or review your submitted data</li>
                                <li>• Request early deletion of your data</li>
                                <li>• Withdraw your consent at any time</li>
                            </ul>
                        </div>

                        <div className="bg-base-200 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">Third-Party Services</h4>
                            <p className="text-sm mb-2">
                                We may use secure third-party services (such as cloud storage or AI processing APIs) to analyze your images. These services are GDPR-compliant and are used only to deliver our app’s core features.
                            </p>
                        </div>

                        <div className="bg-info bg-opacity-20 p-3 rounded-lg mb-4">
                            <p className="text-xs">
                                <strong>Security:</strong> We take your privacy seriously. Your images are encrypted in storage and transit. However, no method of electronic storage is 100% secure, so we encourage responsible use of the app.
                            </p>
                        </div>

                        <div className="bg-warning bg-opacity-20 p-3 rounded-lg mb-4">
                            <p className="text-xs">
                                <strong>Age Restriction:</strong> This app is not intended for children under the age of 18. If we learn that we have collected image data from a child without verified parental consent, we will delete it immediately.
                            </p>
                        </div>

                    </div>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="modal-action">
                        <button
                            className="btn btn-outline"
                            onClick={handleDecline}
                            disabled={actionLoading}
                        >
                            Decline
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleAccept}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Processing...
                                </>
                            ) : (
                                'Accept & Continue'
                            )}
                        </button>
                    </div>
                </div>

                {/* Optional: Allow closing by clicking outside */}
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
};

export default DataPrivacyAcceptanceModal;