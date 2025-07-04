import { ArrowLeft, ShieldCheck } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";

const DataPrivacyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Page>
            <Header>
                <ArrowLeft
                    className="absolute left-8 cursor-pointer text-gray-600 hover:text-black transition-colors p-1 hover:bg-gray-100 rounded-full"
                    onClick={() => { navigate(RoutePath.HOME) }}
                    size={28}
                />
                <h1 className="text-xl font-semibold">Privacy & Data Use Policy</h1>
            </Header>

            <Spacer />

            <div className="py-6 space-y-6">

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="text-gray-700" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">Welcome to Snap2Fit</h2>
                    </div>
                    <p className="text-gray-700 text-sm">
                        We respect your privacy and want you to understand how we collect, use, and protect your information.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-2">
                    <h3 className="text-md font-semibold text-gray-800">What We Collect</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        <li>A front-facing photo</li>
                        <li>A side-view photo</li>
                        <li>A back-view photo</li>
                    </ul>
                    <p className="text-sm text-gray-700">
                        These images are processed to generate a 3D body model for virtual clothing fitting.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-2">
                    <h3 className="text-md font-semibold text-gray-800">How We Use Your Photos</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        <li>To analyze body proportions</li>
                        <li>To generate a personalized 3D model</li>
                        <li>To recommend clothing sizes accurately</li>
                    </ul>
                    <p className="text-sm text-gray-700">
                        We do not use your images for any other purpose (e.g., marketing or advertising) without your consent.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-2">
                    <h3 className="text-md font-semibold text-gray-800">Data Retention Policy</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        <li>Stored securely</li>
                        <li>Automatically deleted after 30 days</li>
                        <li>Can be manually deleted at any time upon your request</li>
                    </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-2">
                    <h3 className="text-md font-semibold text-gray-800">Consent & Your Rights</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        <li>Access or review your submitted data</li>
                        <li>Request early deletion of your data</li>
                        <li>Withdraw your consent at any time</li>
                    </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-2">
                    <h3 className="text-md font-semibold text-gray-800">Third-Party Services</h3>
                    <p className="text-sm text-gray-700">
                        We may use secure third-party services (such as cloud storage or AI processing APIs) to analyze your images. These services are GDPR-compliant and are used only to deliver our app’s core features.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-2">
                    <h3 className="text-md font-semibold text-gray-800">Data Security</h3>
                    <p className="text-sm text-gray-700">
                        Your images are encrypted in storage and transit. However, no method of electronic storage is 100% secure, so we encourage responsible use of the app.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-2">
                    <h3 className="text-md font-semibold text-gray-800">Children's Privacy</h3>
                    <p className="text-sm text-gray-700">
                        This app is not intended for children under the age of 18. If we learn that we have collected image data from a child without verified parental consent, we will delete it immediately.
                    </p>
                </div>

            </div>
        </Page>
    );
};

export default DataPrivacyPage;
