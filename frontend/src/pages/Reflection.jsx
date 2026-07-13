const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Sparkles, ArrowRight, Lightbulb, Check, PenLine } from 'lucide-react';
import AIAssistantCard from '@/components/AIAssistantCard';

const questions = [
  { id: 'learned', label: 'What did you learn?', placeholder: 'Reflect on the key insights you gained from this experience...', icon: Lightbulb },
  { id: 'signs', label: 'What signs did you notice?', placeholder: 'Describe the warning signs or patterns you observed in the scenario...', icon: Sparkles },
  { id: 'action', label: 'What action would you take?', placeholder: 'If you encountered a similar situation in real life, what would you do?', icon: PenLine }
];

export default function Reflection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({ learned: '', signs: '', action: '' });
  const [generating, setGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const exp = await db.entities.Experience.get(id);
        setExperience(exp);
      } catch {
        // ignore
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const allFilled = Object.values(answers).every(a => a.trim().length > 10);

  const handleGenerate = async () => {
    if (!allFilled) return;
    setGenerating(true);
    try {
      const result = await db.integrations.Core.InvokeLLM({
        prompt: `A learner just completed an interactive awareness scenario titled "${experience?.title}" about ${experience?.category}. Here is the scenario context: ${experience?.description}\n\nThe learner reflected on these questions:\n\n1. What did you learn?\n${answers.learned}\n\n2. What signs did you notice?\n${answers.signs}\n\n3. What action would you take?\n${answers.action}\n\nBased on their reflections, provide:\n1. A warm, encouraging summary (2-3 sentences) of their learning journey\n2. Three key lessons they should take away\n3. One personal insight or growth area\n\nBe empathetic, hopeful, and constructive. Avoid fear-based language. Focus on awareness, safety, and empowerment.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_lessons: { type: "array", items: { type: "string" } },
            personal_insight: { type: "string" }
          }
        }
      });

      const aiData = typeof result === 'string' ? JSON.parse(result) : result;
      setAiResult(aiData);

      await db.entities.Reflection.create({
        experience_title: experience?.title,
        what_you_learned: answers.learned,
        signs_noticed: answers.signs,
        action_taken: answers.action,
        ai_summary: aiData.summary,
        key_lessons: aiData.key_lessons
      });
    } catch {
      // Fallback if LLM fails
      setAiResult({
        summary: 'Thank you for taking the time to reflect on this experience. Your thoughtful engagement shows a genuine commitment to awareness and safety.',
        key_lessons: ['Awareness begins with noticing subtle patterns', 'Safe action always starts with seeking guidance', 'Every person can be a source of support'],
        personal_insight: 'Your reflections suggest you are developing a strong awareness mindset — continue trusting your instincts and seeking knowledge.'
      });
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aiblue/5 border border-aiblue/10 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-aiblue" />
          <span className="text-xs font-semibold text-aiblue">Reflection</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-navy mb-3 text-balance">
          Let's reflect on what you learned
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          {experience?.title ? `From "${experience.title}" — ` : ''}Take a moment to process your experience. Your AI companion will help draw out key insights.
        </p>
      </div>

      {/* Question cards */}
      {!aiResult && (
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          {questions.map((q) => {
            const Icon = q.icon;
            return (
              <div key={q.id} className={`glass-card p-6 transition-all ${focused === q.id ? 'ring-2 ring-aiblue/30 shadow-lg' : ''}`}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-aiblue/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-aiblue" />
                  </div>
                  <h3 className="font-heading font-semibold text-navy">{q.label}</h3>
                </div>
                <textarea
                  value={answers[q.id]}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  onFocus={() => setFocused(q.id)}
                  onBlur={() => setFocused(null)}
                  placeholder={q.placeholder}
                  rows={3}
                  className="w-full bg-transparent text-sm text-navy placeholder:text-slate-300 resize-none outline-none leading-relaxed"
                />
              </div>
            );
          })}

          <button
            onClick={handleGenerate}
            disabled={!allFilled || generating}
            className={`group w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all ${
              allFilled && !generating
                ? 'bg-navy text-white hover:bg-navy-dark hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating AI insights...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate AI Reflection
              </>
            )}
          </button>
          {!allFilled && <p className="text-center text-xs text-slate-400">Please answer all questions (at least a sentence each) to continue</p>}
        </div>
      )}

      {/* AI Results */}
      {aiResult && (
        <div className="space-y-5 animate-fade-in-up">
          <AIAssistantCard title="Your AI Reflection">
            <p className="mb-4 text-navy">{aiResult.summary}</p>

            <div className="mb-4">
              <p className="text-xs font-semibold text-aiblue uppercase tracking-wide mb-2">Key Lessons</p>
              <div className="space-y-2">
                {aiResult.key_lessons?.map((lesson, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <p className="text-sm text-navy">{lesson}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gold/5 rounded-xl border border-gold/15">
              <p className="text-xs font-semibold text-gold-dark uppercase tracking-wide mb-1">Personal Insight</p>
              <p className="text-sm text-navy">{aiResult.personal_insight}</p>
            </div>
          </AIAssistantCard>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate(`/knowledge-check/${id}`)} className="flex-1 flex items-center justify-center gap-2 bg-navy text-white font-semibold py-3 rounded-xl hover:bg-navy-dark transition-all">
              Take Knowledge Check <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/workspace')} className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-navy font-semibold py-3 rounded-xl hover:bg-slate-50 transition-all">
              Back to Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}