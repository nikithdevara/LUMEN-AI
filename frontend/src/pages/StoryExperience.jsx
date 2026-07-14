const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Sparkles, ArrowRight, ArrowLeft, Check, Brain, BookOpen, Lightbulb, X } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import ChoiceButton from '@/components/ChoiceButton';
import AIAssistantCard from '@/components/AIAssistantCard';
import TypingText from '@/components/TypingText';

export default function StoryExperience() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const exp = await db.entities.Experience.get(id);
        setExperience(exp);
        // Check for existing progress
        const prog = await db.entities.UserProgress.filter({ experience_id: id });
        if (prog && prog.length > 0) {
          setUserProgress(prog[0]);
          setCurrentSceneIdx(prog[0].current_scene || 0);
        } else {
          const newProg = await db.entities.UserProgress.create({
            experience_id: id,
            experience_title: exp.title,
            status: 'in_progress',
            current_scene: 0,
            progress_percent: 0
          });
          setUserProgress(newProg);
        }
      } catch {
        // handle error
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const scenes = experience?.scenes || [];
  const currentScene = scenes[currentSceneIdx];
  const totalScenes = scenes.length;

  const handleSelectChoice = (choice) => {
    if (revealed) return;
    setSelectedChoice(choice);
    setRevealed(true);
  };

  const handleNext = async () => {
    const nextScene = selectedChoice?.next_scene || currentSceneIdx + 1;

    if (nextScene >= totalScenes || currentSceneIdx + 1 >= totalScenes) {
      // Experience complete
      try {
        const score = userProgress?.score || 0;
        await db.entities.UserProgress.update(userProgress.id, {
          status: 'completed',
          progress_percent: 100,
          current_scene: totalScenes - 1,
          score: score + (selectedChoice?.is_recommended ? 10 : 0)
        });
      } catch {
        // ignore
      }
      navigate(`/reflection/${id}`);
    } else {
      const newIdx = Math.min(nextScene, totalScenes - 1);
      setCurrentSceneIdx(newIdx);
      setSelectedChoice(null);
      setRevealed(false);
      const progressPercent = Math.round(((newIdx + 1) / totalScenes) * 100);
      try {
        await db.entities.UserProgress.update(userProgress.id, {
          current_scene: newIdx,
          progress_percent: progressPercent,
          score: (userProgress?.score || 0) + (selectedChoice?.is_recommended ? 10 : 0)
        });
      } catch {
        // ignore
      }
    }
  };

  const handleBack = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx(currentSceneIdx - 1);
      setSelectedChoice(null);
      setRevealed(false);
    } else {
      navigate('/workspace');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="font-heading font-bold text-xl text-navy mb-2">Experience not found</h2>
        <button onClick={() => navigate('/workspace')} className="text-aiblue font-semibold">Back to workspace</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-navy" />
            </button>
            <div>
              <p className="text-xs font-semibold text-aiblue">{experience.category}</p>
              <h1 className="font-heading font-bold text-lg text-navy">{experience.title}</h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            <span>Scene {currentSceneIdx + 1} of {totalScenes}</span>
          </div>
        </div>
        <ProgressBar value={Math.round(((currentSceneIdx + 1) / totalScenes) * 100)} height="h-1.5" />
      </div>

      {/* Scene timeline */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
        {scenes.map((scene, i) => (
          <div
            key={i}
            className={`flex-shrink-0 h-1.5 rounded-full transition-all duration-300 ${
              i === currentSceneIdx ? 'w-10 bg-aiblue' : i < currentSceneIdx ? 'w-6 bg-aiblue/40' : 'w-6 bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Three panel layout */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Left: Story content */}
        <div className="lg:col-span-4 animate-fade-in" key={`story-${currentSceneIdx}`}>
          <div className="glass-card p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-navy" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Story</span>
            </div>
            <h2 className="font-heading font-bold text-xl text-navy mb-3">{currentScene?.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{currentScene?.narrative}</p>
          </div>
        </div>

        {/* Center: Scene visualization + choices */}
        <div className="lg:col-span-5 space-y-4 animate-scale-in" key={`scene-${currentSceneIdx}`}>
          {/* Scene visualization */}
          <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 gradient-navy" />
            <div className="absolute inset-0 bg-gradient-to-br from-aiblue/20 via-transparent to-gold/10" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-aiblue/30 rounded-full blur-3xl animate-glow-pulse" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/20 rounded-full blur-3xl animate-float" />
            <div className="relative h-full flex items-center justify-center p-6">
              <div className="text-center">
                <div className="relative inline-block mb-3">
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full animate-glow-pulse" />
                  <div className="relative w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-white/70 max-w-xs mx-auto">{currentScene?.context}</p>
              </div>
            </div>
          </div>

          {/* Choices */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">What would you do?</p>
            {currentScene?.choices?.map((choice) => (
              <ChoiceButton
                key={choice.id}
                label={choice.label}
                letter={choice.id}
                selected={selectedChoice?.id === choice.id}
                revealed={revealed}
                isRecommended={choice.is_recommended}
                onClick={() => handleSelectChoice(choice)}
                disabled={revealed}
              />
            ))}
          </div>

          {/* Outcome */}
          {revealed && selectedChoice && (
            <div className="animate-fade-in-up">
              <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Outcome</p>
                <p className="text-sm text-navy">{selectedChoice.outcome}</p>
              </div>
              <button
                onClick={handleNext}
                className="w-full mt-3 flex items-center justify-center gap-2 bg-navy text-white font-semibold py-3 rounded-xl hover:bg-navy-dark transition-all hover:shadow-lg"
              >
                {currentSceneIdx + 1 >= totalScenes ? 'Complete & Reflect' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: AI guidance */}
        <div className="lg:col-span-3 animate-slide-in-right" key={`ai-${currentSceneIdx}`}>
          {revealed && selectedChoice ? (
            <AIAssistantCard title="Why this choice matters" streaming={!revealed}>
              <TypingText text={selectedChoice.ai_explanation} className="mb-3" />
              <div className="flex items-start gap-2 p-3 bg-aiblue/5 dark:bg-aiblue/10 rounded-xl border border-aiblue/10 dark:border-aiblue/20">
                <Lightbulb className="w-4 h-4 text-aiblue flex-shrink-0 mt-0.5" />
                <p className="text-xs text-navy">
                  {selectedChoice.is_recommended
                    ? 'This is the recommended approach. Well done choosing a safe, responsible path.'
                    : 'Consider what a safer, more aware response might look like. The recommended path prioritizes safety and appropriate action.'}
                </p>
              </div>
            </AIAssistantCard>
          ) : (
            <div className="glass-card p-5 h-full flex flex-col items-center justify-center text-center min-h-[200px]">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-aiblue/20 blur-xl rounded-full animate-glow-pulse" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-aiblue to-indigo-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-sm font-heading font-semibold text-navy mb-1">AI Guide</p>
              <p className="text-xs text-slate-400">Make a choice to receive AI-powered guidance and insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}