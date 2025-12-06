import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, X, AlertTriangle, Lock, Eye, Trash2, Download } from 'lucide-react';
import { Button } from './Button';

// --- CONSENT MODAL (Section 3.1 of Compliance Doc) ---
interface ConsentModalProps {
    onAccept: () => void;
    onDecline: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept, onDecline }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">Parent/Guardian Consent Required</h2>
                    </div>
                    <p className="text-primary-100">Before your child can use ScholarLens AI, we need your informed consent.</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Key Points */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary-600" />
                            What We Collect
                        </h3>
                        <ul className="text-sm text-gray-700 space-y-2 ml-7">
                            <li>• <strong>Activity data:</strong> Handwriting samples, audio recordings (reading aloud), video snippets</li>
                            <li>• <strong>Profile data:</strong> Child's name/nickname, age, grade</li>
                            <li>• <strong>AI-generated insights:</strong> Non-diagnostic screening scores and suggestions</li>
                        </ul>

                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-primary-600" />
                            How We Protect Data
                        </h3>
                        <ul className="text-sm text-gray-700 space-y-2 ml-7">
                            <li>• Data is encrypted in transit and at rest</li>
                            <li>• Raw video/audio deleted after 90 days</li>
                            <li>• No advertising, no data selling, no third-party sharing</li>
                            <li>• You can export or delete all data at any time</li>
                        </ul>

                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-semantic-warning" />
                            Important Disclaimer
                        </h3>
                        <div className="bg-semantic-warning-light border-2 border-semantic-warning rounded-lg p-4 ml-7">
                            <p className="text-sm text-semantic-warning-dark font-medium">
                                ScholarLens AI is a <strong>SCREENING TOOL ONLY</strong>, not a diagnostic instrument.
                                It does NOT diagnose learning disabilities. All results must be reviewed by qualified
                                healthcare or educational professionals.
                            </p>
                        </div>
                    </div>

                    {/* Expandable Details */}
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-primary-600 text-sm font-medium hover:underline"
                    >
                        {showDetails ? '▼ Hide full details' : '▶ Show full data collection details'}
                    </button>

                    {showDetails && (
                        <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-2 max-h-40 overflow-y-auto">
                            <p><strong>Data Retention:</strong> Raw media: 90 days. Derived scores: up to 3 years for longitudinal tracking. Reports: until you delete.</p>
                            <p><strong>Your Rights:</strong> Access, rectification, deletion, portability, withdrawal of consent.</p>
                            <p><strong>Legal Basis:</strong> Explicit consent (GDPR Art. 6(1)(a), COPPA, DPDP Act 2023).</p>
                            <p><strong>Contact:</strong> privacy@scholarlens.ai</p>
                        </div>
                    )}

                    {/* Consent Checkbox */}
                    <label className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg border-2 border-primary-200 cursor-pointer hover:bg-primary-100 transition-colors">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-2 border-primary-400 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-800">
                            <strong>I confirm that I am the parent or legal guardian</strong> of the child who will use this application.
                            I have read and understand the data collection practices described above, and I give my informed consent
                            for ScholarLens AI to collect and process my child's data as described.
                        </span>
                    </label>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
                    <Button variant="outline" onClick={onDecline}>
                        Decline & Exit
                    </Button>
                    <Button
                        onClick={onAccept}
                        disabled={!isChecked}
                        className={!isChecked ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        I Agree & Continue
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- AGE GATE MODAL (Section 7 - Age Gating) ---
interface AgeGateProps {
    onParentTeacher: () => void;
    onChild: () => void;
}

export const AgeGateModal: React.FC<AgeGateProps> = ({ onParentTeacher, onChild }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-gradient-to-b from-sky-400 to-green-200 z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
            >
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ScholarLens AI!</h2>
                <p className="text-gray-600 mb-8">Who are you?</p>

                <div className="space-y-4">
                    <button
                        onClick={onParentTeacher}
                        className="w-full p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3"
                    >
                        👨‍👩‍👧 I'm a Parent or Teacher
                    </button>
                    <button
                        onClick={onChild}
                        className="w-full p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-3"
                    >
                        🧒 I'm a Kid
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- CHILD BLOCKED SCREEN (Section 7) ---
export const ChildBlockedScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-gradient-to-b from-purple-400 to-pink-300 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! You Need a Grown-Up!</h2>
                <p className="text-gray-600 mb-6">
                    Please ask your parent, guardian, or teacher to set up ScholarLens AI for you.
                    They'll help you get started on your learning adventure!
                </p>
                <div className="bg-purple-100 rounded-xl p-4 text-sm text-purple-800">
                    <strong>Tell them:</strong> "I want to try ScholarLens AI! Can you help me set it up?"
                </div>
            </div>
        </div>
    );
};

// --- ACTIVITY DISCLAIMER MODAL (Section 8.1) ---
interface ActivityDisclaimerProps {
    activityName: string;
    onAccept: () => void;
    onCancel: () => void;
}

export const ActivityDisclaimerModal: React.FC<ActivityDisclaimerProps> = ({
    activityName,
    onAccept,
    onCancel
}) => {
    const [acknowledged, setAcknowledged] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
                <div className="bg-semantic-error p-4 text-white">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" />
                        <h3 className="font-bold text-lg">Before You Start: {activityName}</h3>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-semantic-error-light border-2 border-semantic-error rounded-lg p-4">
                        <p className="text-semantic-error-dark font-medium text-sm">
                            <strong>⚠️ SCREENING TOOL ONLY</strong><br />
                            This activity provides screening insights, NOT a medical or educational diagnosis.
                            Results must be reviewed by qualified professionals before any conclusions are drawn.
                        </p>
                    </div>

                    <div className="text-sm text-gray-600 space-y-2">
                        <p>During this activity, we will:</p>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Record {activityName.includes('Reading') ? 'audio/video' : activityName.includes('Writing') ? 'handwriting strokes' : 'video'} for AI analysis</li>
                            <li>Generate non-diagnostic screening scores</li>
                            <li>Provide suggestions for discussion with professionals</li>
                        </ul>
                    </div>

                    <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acknowledged}
                            onChange={(e) => setAcknowledged(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-2 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">
                            I understand this is a <strong>screening tool only</strong> and not a diagnosis.
                        </span>
                    </label>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button onClick={onAccept} disabled={!acknowledged}>
                        Start Activity
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- DATA MANAGEMENT PANEL (Section 5.2) ---
interface DataManagementProps {
    profileName: string;
    assessmentCount: number;
    onExport: () => void;
    onDelete: () => void;
}

export const DataManagementPanel: React.FC<DataManagementProps> = ({
    profileName,
    assessmentCount,
    onExport,
    onDelete
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-bold text-gray-900">Manage Your Child's Data</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Profile:</span>
                    <span className="font-medium text-gray-900">{profileName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Assessments stored:</span>
                    <span className="font-medium text-gray-900">{assessmentCount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Data retention:</span>
                    <span className="font-medium text-gray-900">90 days (media), 3 years (scores)</span>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={onExport}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium"
                >
                    <Download className="w-5 h-5" />
                    Export All Data (JSON)
                </button>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                        <Trash2 className="w-5 h-5" />
                        Delete All Data
                    </button>
                ) : (
                    <div className="bg-semantic-error-light border-2 border-semantic-error rounded-lg p-4 space-y-3">
                        <p className="text-semantic-error-dark text-sm font-medium">
                            ⚠️ This will permanently delete all profiles and assessment data. This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 p-2 bg-gray-200 text-gray-700 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onDelete}
                                className="flex-1 p-2 bg-semantic-error text-white rounded-lg font-medium"
                            >
                                Yes, Delete Everything
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-500 text-center">
                Questions? Contact <a href="mailto:privacy@scholarlens.ai" className="text-primary-600 underline">privacy@scholarlens.ai</a>
            </p>
        </div>
    );
};
