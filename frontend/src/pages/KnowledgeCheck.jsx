import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, ArrowRight, Sparkles, Trophy, Brain, RotateCcw } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import AIAssistantCard from '@/components/AIAssistantCard';

const quizQuestions = [
  {
    question: 'Which of the following can be a subtle warning sign of exploitation in a workplace?',
    choices: [
      'A coworker who occasionally arrives late to work',
      'Someone who appears controlled by another person and avoids eye contact',
      'A colleague who keeps to themselves during lunch breaks',
      'An employee who prefers direct deposit over paper checks'
    ],
    correct: 1,
    explanation: 'When someone appears to be controlled by another person—someone else speaking for them, monitoring their interactions, or restricting their movement—this can be a subtle indicator of exploitation. Isolation from coworkers is also common.',
    aiInsight: 'Trafficking often involves subtle control mechanisms that may not be immediately obvious. The key is noticing patterns of control, isolation, and fear rather than isolated behaviors.'
  },
  {
    question: 'What is the safest first step if you notice concerning behavior in a workplace?',
    choices: [
      'Confront the suspected perpetrator directly',
      'Ignore it — it is probably nothing',
      'Document what you observed and report to a supervisor or hotline',
      'Post about it on social media to warn others'
    ],
    correct: 2,
    explanation: 'Documenting observations and reporting through proper channels—supervisors, HR, or the National Human Trafficking Hotline—ensures the situation is handled safely and professionally. Direct confrontation can be dangerous.',
    aiInsight: 'Safe response always prioritizes proper channels over direct intervention. Your role is to be an aware observer and reporter, not an investigator or enforcer.'
  },
  {
    question: 'Why is isolation from coworkers and community a significant risk factor?',
    choices: [
      'It indicates the person prefers solitude',
      'Isolation makes someone more vulnerable to exploitation and harder to help',
      'It means the person is antisocial',
      'Isolation has no connection to trafficking risks'
    ],
    correct: 1,
    explanation: 'Isolation is a key tactic used by traffickers to maintain control. When someone is cut off from support networks—coworkers, friends, family—they become more dependent on the trafficker and less likely to seek help.',
    aiInsight: 'Building and maintaining community connections is one of the most effective protective factors against exploitation. Awareness and connection go hand in hand.'
  },
  {
    question: 'In a hospitality setting, which situation warrants further attention?',
    choices: [
      'A guest who requests extra towels',
      'A guest checking in with someone who speaks for them, has no ID, and seems fearful',
      'A guest who prefers not to interact with staff',
      'A guest who pays in cash for a one-night stay'
    ],
    correct: 1,
    explanation: 'Multiple indicators together—a companion speaking for the guest, lack of personal ID, visible fear—create a pattern that warrants attention. Single indicators alone are not conclusive, but clusters of signs should be reported.',
    aiInsight: 'Hotel staff are often in a unique position to notice patterns. Training programs help staff recognize these clusters of indicators and respond appropriately through established protocols.'
  },
  {
    question: 'What is the most empowering thing an individual can do to combat trafficking?',
    choices: [
      'Attempt to rescue victims directly',
      'Stay informed, recognize signs, and report through proper channels',
      'Avoid learning about the topic to stay safe',
      'Rely entirely on law enforcement to handle everything'
    ],
    correct: 1,
    explanation: 'Education and awareness are the most powerful tools. By learning to recognize signs and reporting through proper channels, individuals become part of a larger solution without putting themselves or potential victims at risk.',
    aiInsight: 'Awareness is not about being a hero—it is about being informed, observant, and connected to the right resources. Every report through proper channels can make a difference.'
  }
];

export default function KnowledgeCheck() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[currentIdx];
  const total = quizQuestions.length;

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    if (idx === question.correct) {
      setScore(score + 1);
    }
    setAnswers([...answers, { questionIdx: currentIdx, selected: idx, correct: idx === question.correct }]);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 60;
    return (
      <div className="max-w-2xl mx-auto px-6">
        <div className="glass-card p-8 text-center animate-scale-in">
          <div className="relative inline-block mb-6">
            <div className={`absolute inset-0 ${passed ? 'bg-success/20' : 'bg-aiblue/20'} blur-2xl rounded-full animate-glow-pulse`} />
            <div className={`relative w-20 h-20 rounded-2xl ${passed ? 'bg-gradient-to-br from-success to-emerald-600' : 'bg-gradient-to-br from-aiblue to-indigo-500'} flex items-center justify-center shadow-xl`}>
              <Trophy className="w-9 h-9 text-white" />
            </div>
          </div>
          <h2 className="font-heading font-extrabold text-3xl text-navy mb-2">{passed ? 'Well done!' : 'Keep learning!'}</h2>
          <p className="text-slate-500 mb-6">You scored {score} out of {total} ({percentage}%)</p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Learning Score</span>
              <span className="font-heading font-bold text-navy">{percentage}%</span>
            </div>
            <ProgressBar value={percentage} height="h-3" color={passed ? 'success' : 'ai'} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/recommendations')} className="flex-1 flex items-center justify-center gap-2 bg-navy text-white font-semibold py-3 rounded-xl hover:bg-navy-dark transition-all">
              View Recommendations <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={handleRestart} className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-navy font-semibold px-5 py-3 rounded-xl hover:bg-slate-50 transition-all">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aiblue to-indigo-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-aiblue">Knowledge Check</p>
              <h1 className="font-heading font-bold text-lg text-navy">Test your awareness</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Score</p>
            <p className="font-heading font-bold text-lg text-navy">{score}/{total}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Question {currentIdx + 1} of {total}</span>
          <span className="text-xs text-slate-400">{Math.round(((currentIdx + 1) / total) * 100)}%</span>
        </div>
        <ProgressBar value={Math.round(((currentIdx + 1) / total) * 100)} height="h-1.5" />
      </div>

      {/* Question */}
      <div key={currentIdx} className="space-y-4 animate-fade-in-up">
        <div className="glass-card p-6">
          <p className="font-heading font-semibold text-navy text-lg mb-5">{question.question}</p>
          <div className="space-y-2.5">
            {question.choices.map((choice, idx) => {
              const isSelected = selected === idx;
              const isCorrect = idx === question.correct;
              const showCorrect = revealed && isCorrect;
              const showIncorrect = revealed && isSelected && !isCorrect;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={revealed}
                  className={`group w-full text-left p-3.5 rounded-xl border-2 transition-all duration-300 ${
                    !revealed && !isSelected ? 'border-slate-200 bg-white/50 hover:border-aiblue/50 hover:bg-white/80 cursor-pointer' : ''
                  } ${isSelected && !revealed ? 'border-aiblue bg-aiblue/5' : ''} ${
                    showCorrect ? 'border-success bg-success/5' : ''
                  } ${showIncorrect ? 'border-destructive/40 bg-destructive/5' : ''} ${
                    revealed && !isSelected && !isCorrect ? 'border-slate-100 opacity-50' : ''
                  } ${revealed ? 'cursor-default' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
                      !revealed && !isSelected ? 'bg-slate-100 text-slate-500 group-hover:bg-aiblue/10 group-hover:text-aiblue' : ''
                    } ${isSelected && !revealed ? 'bg-aiblue text-white' : ''} ${
                      showCorrect ? 'bg-success text-white' : ''
                    } ${showIncorrect ? 'bg-destructive/80 text-white' : ''} ${
                      revealed && !isSelected && !isCorrect ? 'bg-slate-100 text-slate-400' : ''
                    }`}>
                      {showCorrect ? <Check className="w-3.5 h-3.5" /> : showIncorrect ? <X className="w-3.5 h-3.5" /> : String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 text-sm font-medium text-navy">{choice}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {revealed && (
          <div className="animate-fade-in-up space-y-3">
            <AIAssistantCard title="AI Explanation">
              <p className="mb-3">{question.explanation}</p>
              <div className="flex items-start gap-2 p-3 bg-gold/5 rounded-xl border border-gold/15">
                <Sparkles className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
                <p className="text-xs text-navy">{question.aiInsight}</p>
              </div>
            </AIAssistantCard>
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 bg-navy text-white font-semibold py-3 rounded-xl hover:bg-navy-dark transition-all hover:shadow-lg"
            >
              {currentIdx + 1 >= total ? 'See Results' : 'Next Question'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}