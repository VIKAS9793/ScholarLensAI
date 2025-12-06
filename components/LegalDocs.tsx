import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Shield, FileText, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './Button';

// --- PRIVACY POLICY COMPONENT ---
interface LegalDocModalProps {
    onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<LegalDocModalProps> = ({ onClose }) => {
    const [expandedSection, setExpandedSection] = useState<string | null>('collect');

    const sections = [
        {
            id: 'collect',
            title: '1. What We Collect',
            content: `We collect the following data categories:

• **Account Data**: Parent/guardian name, email, relationship to child
• **Child Profile Data**: Name/nickname, age, grade, preferences
• **Activity Data**: Handwriting samples (stroke coordinates), audio recordings (reading), video snippets (focus tasks)
• **AI-Generated Data**: Non-diagnostic screening scores, recommendations, confidence levels
• **Technical Data**: Device type, browser, IP address (for security)`
        },
        {
            id: 'why',
            title: '2. Why We Collect It',
            content: `We use your data solely to:

• Deliver screening activities and generate reports
• Provide personalized educational insights
• Improve our AI models (using anonymized, aggregated data only)
• Ensure security and prevent abuse

**We do NOT use data for advertising or sell to third parties.**`
        },
        {
            id: 'retention',
            title: '3. How Long We Keep It',
            content: `• **Raw video/audio**: Automatically deleted after 90 days
• **Derived scores & reports**: Retained up to 3 years for longitudinal tracking
• **Account data**: Retained until you delete your account

You can delete all data at any time via "Manage Your Child's Data" in the app.`
        },
        {
            id: 'rights',
            title: '4. Your Rights',
            content: `Under GDPR, DPDP Act, and COPPA, you have the right to:

• **Access**: View all data we hold about your child
• **Rectification**: Correct inaccurate profile information
• **Deletion**: Request complete deletion of all data
• **Portability**: Export data in JSON/PDF format
• **Withdraw Consent**: Stop processing at any time

To exercise these rights, use the in-app data management tools or contact privacy@scholarlens.ai`
        },
        {
            id: 'security',
            title: '5. Security Measures',
            content: `• Data encrypted in transit (TLS 1.3) and at rest (AES-256)
• Role-based access control with least privilege
• Regular security audits and penetration testing
• No engineer access to raw media without just-in-time authorization and logging`
        },
        {
            id: 'children',
            title: '6. Children\'s Privacy',
            content: `ScholarLens AI is designed with children's privacy as a priority:

• No public profiles or social features
• No advertising or behavioral tracking
• No direct collection of identifying info from children
• Parent/guardian consent required before any data collection
• COPPA and GDPR-Kids compliant design`
        },
        {
            id: 'contact',
            title: '7. Contact Us',
            content: `**Data Protection Contact:**
privacy@scholarlens.ai

**Mailing Address:**
ScholarLens AI Privacy Team
[Address to be added]

Last updated: December 2024`
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div className="bg-primary-600 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Privacy Policy</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <p className="text-gray-600 mb-6">
                        ScholarLens AI is committed to protecting your and your child's privacy.
                        This policy explains how we collect, use, and safeguard your data.
                    </p>

                    <div className="space-y-2">
                        {sections.map((section) => (
                            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                                    className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left"
                                >
                                    <span className="font-medium text-gray-900">{section.title}</span>
                                    {expandedSection === section.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedSection === section.id && (
                                    <div className="px-4 pb-4 text-sm text-gray-700 whitespace-pre-line">
                                        {section.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t">
                    <Button onClick={onClose} className="w-full">Close</Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- TERMS OF SERVICE COMPONENT ---
export const TermsOfServiceModal: React.FC<LegalDocModalProps> = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div className="bg-gray-800 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Scale className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Terms of Service</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-700 space-y-6">
                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">1. Acceptance of Terms</h3>
                        <p>By accessing or using ScholarLens AI, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">2. Intended Use</h3>
                        <p>ScholarLens AI is a <strong>screening and educational support tool</strong> designed for:</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>Parents and guardians monitoring their child's learning patterns</li>
                            <li>Teachers and educators gathering preliminary insights</li>
                            <li>School psychologists as a supplementary data source</li>
                        </ul>
                    </section>

                    <section className="bg-semantic-error-light border-2 border-semantic-error rounded-lg p-4">
                        <h3 className="font-bold text-semantic-error-dark mb-2">3. Medical Disclaimer</h3>
                        <p className="text-semantic-error-dark">
                            <strong>ScholarLens AI is NOT a medical device and does NOT diagnose any conditions.</strong>
                            All outputs are screening insights only. Users must consult qualified healthcare or educational
                            professionals for proper evaluation and diagnosis.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">4. User Responsibilities</h3>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Provide accurate information about child's age and grade</li>
                            <li>Ensure appropriate supervision during activities</li>
                            <li>Review all AI-generated insights with appropriate skepticism</li>
                            <li>Do not use results as sole basis for educational or medical decisions</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">5. Prohibited Uses</h3>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Using the service to diagnose or label children</li>
                            <li>Sharing access credentials with unauthorized users</li>
                            <li>Attempting to reverse-engineer the AI models</li>
                            <li>Uploading content not related to legitimate screening activities</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">6. Limitation of Liability</h3>
                        <p>ScholarLens AI is provided "as is" without warranties. We are not liable for decisions made based on screening outputs. Maximum liability is limited to fees paid in the prior 12 months.</p>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">7. Governing Law</h3>
                        <p>These terms are governed by the laws of [Jurisdiction]. Disputes shall be resolved through binding arbitration.</p>
                    </section>

                    <p className="text-gray-500 italic">Last updated: December 2024</p>
                </div>

                <div className="p-4 bg-gray-50 border-t">
                    <Button onClick={onClose} className="w-full">Close</Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- SCREENING DISCLAIMER (For Reports) ---
export const ScreeningDisclaimer: React.FC = () => (
    <div className="bg-semantic-warning-light border border-semantic-warning rounded-lg p-4 text-sm">
        <div className="flex items-start gap-2">
            <FileText className="w-5 h-5 text-semantic-warning-dark flex-shrink-0 mt-0.5" />
            <div className="text-semantic-warning-dark">
                <strong>SCREENING SUMMARY – NOT A DIAGNOSIS</strong>
                <p className="mt-1">
                    This report provides screening insights only. It does not diagnose any learning disability,
                    developmental condition, or medical issue. All findings should be reviewed by qualified
                    healthcare or educational professionals before any decisions are made.
                </p>
            </div>
        </div>
    </div>
);
