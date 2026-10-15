import { ClassifiedResult } from '../types/terminal';

/**
 * InputClassifier: Modular service interface for categorizing user inputs.
 * Currently uses lightweight deterministic heuristic rules for prototype mode.
 * Ready for drop-in connection to an AI / LLM classification API without UI redesign.
 */
export class InputClassifier {
  /**
   * Classifies user input into: COMMAND, QUESTION, CONVERSATION, or UNKNOWN.
   */
  public static async classify(rawInput: string): Promise<ClassifiedResult> {
    const text = rawInput.trim();
    const lower = text.toLowerCase();

    // 1. QUESTION Detection
    const questionStarters = [
      'what', 'how', 'why', 'who', 'where', 'when',
      'which', 'is', 'are', 'can', 'could', 'would',
      'tell me about', 'explain', 'define'
    ];
    const isQuestion = 
      lower.endsWith('?') ||
      questionStarters.some(starter => lower.startsWith(starter + ' '));

    if (isQuestion) {
      return {
        category: 'QUESTION',
        initialStatus: 'AWAITING AI RESPONSE',
        confidence: 0.95,
      };
    }

    // 2. COMMAND Detection (Imperative action verbs)
    const actionVerbs = [
      'open', 'launch', 'start', 'run', 'execute',
      'play', 'pause', 'stop', 'close', 'kill',
      'turn on', 'turn off', 'toggle', 'set',
      'enable', 'disable', 'activate', 'deactivate',
      'search', 'browse', 'reboot', 'calibrate'
    ];

    const matchedVerb = actionVerbs.find(verb => 
      lower.startsWith(verb + ' ') || lower === verb
    );

    if (matchedVerb) {
      // Formulate proposed action for confirmation flow
      const target = text.slice(matchedVerb.length).trim();
      let proposedAction = `Execute Action: ${matchedVerb.toUpperCase()}`;
      
      if (lower.includes('youtube')) {
        proposedAction = 'Launch External Application: YouTube';
      } else if (lower.includes('camera') || lower.includes('surveillance')) {
        proposedAction = 'Access Peripheral Subsystem: Optical Sensors';
      } else if (lower.includes('light') || lower.includes('power')) {
        proposedAction = 'Adjust IoT Power Grid Relay';
      } else if (lower.includes('music') || lower.includes('audio')) {
        proposedAction = 'Audio Subsystem: Start Playback';
      } else if (target) {
        proposedAction = `Action Request: ${matchedVerb.toUpperCase()} [${target}]`;
      }

      return {
        category: 'COMMAND',
        initialStatus: 'AWAITING EXECUTION',
        proposedAction,
        confidence: 0.92,
      };
    }

    // 3. CONVERSATION Detection (Greetings, polite banter)
    const conversationPatterns = [
      'hello', 'hi', 'hey', 'jarvis', 'good morning',
      'good afternoon', 'good evening', 'thanks',
      'thank you', 'how are you', 'who are you', 'status',
      'test', 'bye', 'goodbye'
    ];

    const isConversation = conversationPatterns.some(phrase => 
      lower === phrase || lower.startsWith(phrase + ' ') || lower.startsWith('hey jarvis')
    );

    if (isConversation) {
      return {
        category: 'CONVERSATION',
        initialStatus: 'ACKNOWLEDGED',
        confidence: 0.90,
      };
    }

    // 4. UNKNOWN fallback
    return {
      category: 'UNKNOWN',
      initialStatus: 'AWAITING EXECUTION',
      proposedAction: 'Unverified Directive Processing',
      confidence: 0.35,
    };
  }
}
