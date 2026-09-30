export type StarterCategory = {
  id: string;
  label: string;
  phrases: string[];
};

// Static placeholder phrases (PLAN.md Phase 3). Like the rest of the
// starter vocabulary, this wants an SLT's eyes before a real child relies
// on it.
export const CONVERSATION_STARTERS: StarterCategory[] = [
  {
    id: 'phone',
    label: 'Phone',
    phrases: [
      'Hello, this is me speaking.',
      'Can you repeat that please?',
      "I'll call back later.",
      'Thank you, goodbye.',
    ],
  },
  {
    id: 'counter',
    label: 'Counter',
    phrases: [
      'One please.',
      'Can I pay by card?',
      'Can I have a bag please?',
      'Thank you.',
    ],
  },
  {
    id: 'school',
    label: 'School',
    phrases: [
      'Can you repeat that please?',
      "I don't understand.",
      'Can I go to the toilet?',
      "I've finished.",
    ],
  },
  {
    id: 'meeting-people',
    label: 'Meeting people',
    phrases: [
      'Hello, nice to meet you.',
      'How are you?',
      "I'm well, thank you.",
      'Goodbye.',
    ],
  },
];
