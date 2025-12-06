// AI Audit & Monitoring Service
// Tracks all AI interactions for accountability, explainability, and bias monitoring

export interface AIAuditEntry {
    id: string;
    timestamp: string;
    sessionId: string;
    childProfileId?: string;
    activityType: string;

    // Input data summary (NOT raw data for privacy)
    inputSummary: {
        dataType: 'video' | 'image' | 'text' | 'audio';
        durationSeconds?: number;
        dataQualityScore?: number;
        environmentNotes?: string;
    };

    // AI Output
    output: {
        rawResponse?: string;
        parsedScores?: Record<string, number>;
        confidenceLevel: 'high' | 'medium' | 'low';
        confidenceScore: number;
    };

    // Explainability - What the AI saw
    explainability: {
        observedBehaviors: string[];
        dataPointsUsed: string[];
        alternativeExplanations: string[];
        limitations: string[];
        whatThisDoesNotTell: string[];
    };

    // Safety checks
    safetyChecks: {
        containsLabeling: boolean;
        containsDiagnosis: boolean;
        containsAbilityJudgment: boolean;
        flaggedForReview: boolean;
        flagReason?: string;
    };
}

// Bias & Safety Monitoring
export interface BiasMonitoringEntry {
    timestamp: string;
    flagType: 'labeling' | 'diagnosis' | 'ability_judgment' | 'deficit_language' | 'comparison';
    originalText: string;
    suggestedReplacement?: string;
    wasBlocked: boolean;
}

class AIAuditService {
    private auditLog: AIAuditEntry[] = [];
    private biasFlags: BiasMonitoringEntry[] = [];
    private sessionId: string;

    constructor() {
        this.sessionId = this.generateSessionId();
        this.loadFromStorage();
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private loadFromStorage() {
        try {
            const stored = localStorage.getItem('scholarlens_audit_log');
            if (stored) {
                this.auditLog = JSON.parse(stored);
            }
            const biasStored = localStorage.getItem('scholarlens_bias_flags');
            if (biasStored) {
                this.biasFlags = JSON.parse(biasStored);
            }
        } catch (e) {
            console.error('Failed to load audit log:', e);
        }
    }

    private saveToStorage() {
        try {
            // Keep only last 100 entries for privacy
            const trimmedLog = this.auditLog.slice(-100);
            localStorage.setItem('scholarlens_audit_log', JSON.stringify(trimmedLog));
            localStorage.setItem('scholarlens_bias_flags', JSON.stringify(this.biasFlags.slice(-50)));
        } catch (e) {
            console.error('Failed to save audit log:', e);
        }
    }

    // Log an AI interaction
    logAIInteraction(entry: Omit<AIAuditEntry, 'id' | 'timestamp' | 'sessionId'>): AIAuditEntry {
        const fullEntry: AIAuditEntry = {
            ...entry,
            id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
        };

        // Run safety checks
        fullEntry.safetyChecks = this.runSafetyChecks(fullEntry);

        this.auditLog.push(fullEntry);
        this.saveToStorage();

        return fullEntry;
    }

    // Check AI output for problematic content
    private runSafetyChecks(entry: AIAuditEntry): AIAuditEntry['safetyChecks'] {
        const rawText = entry.output.rawResponse?.toLowerCase() || '';

        // Labeling patterns to flag
        const labelingPatterns = [
            'slow learner', 'struggling', 'behind', 'failing', 'cannot',
            'unable to', 'deficit', 'disorder', 'disabled', 'impaired'
        ];

        // Diagnosis patterns to flag
        const diagnosisPatterns = [
            'dyslexia', 'adhd', 'autism', 'dyscalculia', 'dysgraphia',
            'learning disability', 'diagnosed', 'has', 'suffers from'
        ];

        // Ability judgment patterns
        const abilityPatterns = [
            'low ability', 'poor ability', 'can\'t', 'failed',
            'not smart', 'not intelligent', 'below average'
        ];

        const containsLabeling = labelingPatterns.some(p => rawText.includes(p));
        const containsDiagnosis = diagnosisPatterns.some(p => rawText.includes(p));
        const containsAbilityJudgment = abilityPatterns.some(p => rawText.includes(p));

        const flaggedForReview = containsLabeling || containsDiagnosis || containsAbilityJudgment;

        // Log bias flags
        if (flaggedForReview) {
            this.biasFlags.push({
                timestamp: new Date().toISOString(),
                flagType: containsDiagnosis ? 'diagnosis' : containsLabeling ? 'labeling' : 'ability_judgment',
                originalText: rawText.substring(0, 200),
                wasBlocked: true
            });
        }

        return {
            containsLabeling,
            containsDiagnosis,
            containsAbilityJudgment,
            flaggedForReview,
            flagReason: flaggedForReview
                ? `Flagged for: ${[
                    containsLabeling && 'labeling language',
                    containsDiagnosis && 'diagnostic language',
                    containsAbilityJudgment && 'ability judgment'
                ].filter(Boolean).join(', ')}`
                : undefined
        };
    }

    // Get audit log for export (parent data rights)
    getAuditLog(): AIAuditEntry[] {
        return [...this.auditLog];
    }

    // Get bias monitoring stats
    getBiasStats() {
        return {
            totalInteractions: this.auditLog.length,
            flaggedInteractions: this.auditLog.filter(e => e.safetyChecks.flaggedForReview).length,
            biasFlags: this.biasFlags.length,
            byType: {
                labeling: this.biasFlags.filter(f => f.flagType === 'labeling').length,
                diagnosis: this.biasFlags.filter(f => f.flagType === 'diagnosis').length,
                abilityJudgment: this.biasFlags.filter(f => f.flagType === 'ability_judgment').length,
            }
        };
    }

    // Clear all audit data (for privacy/data deletion)
    clearAllData() {
        this.auditLog = [];
        this.biasFlags = [];
        localStorage.removeItem('scholarlens_audit_log');
        localStorage.removeItem('scholarlens_bias_flags');
    }

    // Export for parent review
    exportForParentReview(): string {
        return JSON.stringify({
            exportDate: new Date().toISOString(),
            sessionCount: new Set(this.auditLog.map(e => e.sessionId)).size,
            totalInteractions: this.auditLog.length,
            biasMonitoring: this.getBiasStats(),
            auditEntries: this.auditLog.map(e => ({
                timestamp: e.timestamp,
                activityType: e.activityType,
                confidenceLevel: e.output.confidenceLevel,
                observedBehaviors: e.explainability.observedBehaviors,
                limitations: e.explainability.limitations,
                safetyChecks: e.safetyChecks
            }))
        }, null, 2);
    }
}

export const aiAuditService = new AIAuditService();

// Explainability helper - generates human-readable explanations
export const generateExplainability = (
    activityType: string,
    observations: string[],
    scores: Record<string, number>
): AIAuditEntry['explainability'] => {
    const limitations = [
        'This observation was brief and may not represent typical behavior',
        'Environmental factors (noise, distractions) may have affected engagement',
        'The child\'s mood, tiredness, or interest level affects results',
        'This is a single data point, not a comprehensive assessment',
        'Screen-based observation cannot capture all learning dimensions'
    ];

    const whatThisDoesNotTell = [
        'This does NOT measure intelligence or cognitive ability',
        'This does NOT diagnose any condition or disability',
        'This does NOT compare your child to other children',
        'This does NOT predict future academic performance',
        'This does NOT indicate what your child is capable of'
    ];

    const alternativeExplanations = [
        'The child may have been tired or hungry during the activity',
        'The environment may have been distracting',
        'The child may not have been interested in this particular activity',
        'Technical issues (camera, lighting) may have affected observation',
        'The child may perform differently in a familiar setting'
    ];

    return {
        observedBehaviors: observations,
        dataPointsUsed: Object.keys(scores).map(k => `${k}: ${scores[k]}%`),
        alternativeExplanations,
        limitations,
        whatThisDoesNotTell
    };
};
