import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye, Brain, AlertTriangle, HelpCircle, ChevronDown, ChevronUp,
    Shield, FileText, Info, CheckCircle, XCircle
} from 'lucide-react';

interface ExplainabilityPanelProps {
    activityType: string;
    observedBehaviors: string[];
    confidenceScore: number;
    confidenceLevel: 'high' | 'medium' | 'low';
    alternativeExplanations: string[];
    limitations: string[];
    whatThisDoesNotTell: string[];
    onClose?: () => void;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
    activityType,
    observedBehaviors,
    confidenceScore,
    confidenceLevel,
    alternativeExplanations,
    limitations,
    whatThisDoesNotTell,
    onClose
}) => {
    const [expandedSection, setExpandedSection] = useState<string | null>('observed');

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const getConfidenceColor = () => {
        switch (confidenceLevel) {
            case 'high': return 'text-green-600 bg-green-50';
            case 'medium': return 'text-amber-600 bg-amber-50';
            case 'low': return 'text-red-600 bg-red-50';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6" />
                    <div>
                        <h3 className="font-bold text-lg">AI Transparency Report</h3>
                        <p className="text-blue-100 text-sm">Understanding how observations were made</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {/* Critical Disclaimer */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-800 font-semibold text-sm">This is NOT an ability assessment</p>
                            <p className="text-red-700 text-xs mt-1">
                                These observations describe engagement patterns only. They do not measure
                                intelligence, capability, or potential. Every child is unique.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Confidence Level */}
                <div className={`rounded-xl p-3 ${getConfidenceColor()}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            <span className="font-medium">Observation Confidence</span>
                        </div>
                        <span className="font-bold">{confidenceScore}% ({confidenceLevel})</span>
                    </div>
                    <p className="text-xs mt-1 opacity-80">
                        {confidenceLevel === 'low' && 'Limited data - these observations should be viewed with caution'}
                        {confidenceLevel === 'medium' && 'Moderate data - consider multiple sessions for better understanding'}
                        {confidenceLevel === 'high' && 'Good data quality - but still just one observation point'}
                    </p>
                </div>

                {/* Expandable Sections */}
                <div className="space-y-2">
                    {/* What We Observed */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleSection('observed')}
                            className="w-full p-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">What We Observed</span>
                            </div>
                            {expandedSection === 'observed' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        <AnimatePresence>
                            {expandedSection === 'observed' && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 space-y-2">
                                        {observedBehaviors.map((behavior, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>{behavior}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Alternative Explanations */}
                    <div className="border border-amber-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleSection('alternatives')}
                            className="w-full p-3 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-amber-600" />
                                <span className="font-medium text-amber-800">Alternative Explanations</span>
                            </div>
                            {expandedSection === 'alternatives' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        <AnimatePresence>
                            {expandedSection === 'alternatives' && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 space-y-2 bg-amber-50/50">
                                        <p className="text-xs text-amber-700 italic mb-2">
                                            The patterns we observed could also be explained by:
                                        </p>
                                        {alternativeExplanations.map((alt, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-amber-800">
                                                <span>•</span>
                                                <span>{alt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* What This Does NOT Tell Us */}
                    <div className="border border-red-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleSection('limitations')}
                            className="w-full p-3 flex items-center justify-between bg-red-50 hover:bg-red-100 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span className="font-medium text-red-800">What This Does NOT Tell Us</span>
                            </div>
                            {expandedSection === 'limitations' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        <AnimatePresence>
                            {expandedSection === 'limitations' && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 space-y-2 bg-red-50/50">
                                        {whatThisDoesNotTell.map((item, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-red-800">
                                                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Limitations */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleSection('techLimitations')}
                            className="w-full p-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-gray-600" />
                                <span className="font-medium">Technical Limitations</span>
                            </div>
                            {expandedSection === 'techLimitations' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        <AnimatePresence>
                            {expandedSection === 'techLimitations' && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 space-y-2">
                                        {limitations.map((limit, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span>•</span>
                                                <span>{limit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Professional Consultation CTA */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-blue-800">Want to discuss these observations?</p>
                            <p className="text-blue-700 text-sm mt-1">
                                Share this report with your child's teacher, pediatrician, or a learning specialist.
                                They can provide professional context and guidance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Compact version for inline display
export const ExplainabilityBadge: React.FC<{
    confidenceLevel: 'high' | 'medium' | 'low';
    onClick?: () => void;
}> = ({ confidenceLevel, onClick }) => {
    const getStyles = () => {
        switch (confidenceLevel) {
            case 'high': return 'bg-green-100 text-green-700 border-green-200';
            case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'low': return 'bg-red-100 text-red-700 border-red-200';
        }
    };

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStyles()} hover:opacity-80 transition-opacity`}
        >
            <Brain className="w-4 h-4" />
            <span>View AI Analysis Details</span>
        </button>
    );
};
