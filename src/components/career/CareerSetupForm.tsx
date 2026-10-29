import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Plus,
  Compass,
  Clock,
  Calendar,
  Layers,
  BookOpen,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import {
  DailyCommitment,
  SkillLevel,
  TargetDuration,
  UserPreferences,
  LearningGoal,
  ResourceBudget,
  LearningFormat,
} from '../../types';

interface CareerSetupFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isSubmitting?: boolean;
}

const CAREER_SUGGESTIONS = [
  'AI & Machine Learning Engineer',
  'Full Stack Cloud Developer',
  'Frontend Engineer & UI Architect',
  'Cloud DevOps & Platform Engineer',
  'Cybersecurity & Threat Analyst',
  'Data Scientist & AI Analytics Engineer',
  'Product Designer & UX/UI Architect',
  'Data Engineer & Big Data Architect',
  'Blockchain & Smart Contract Engineer',
  'Technical Product Manager',
];

export const CareerSetupForm: React.FC<CareerSetupFormProps> = ({ onSubmit, isSubmitting }) => {
  const [searchParams] = useSearchParams();
  const initialCareer = searchParams.get('career') || '';

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Your Direction
  const [jobTitle, setJobTitle] = useState(initialCareer || 'AI Engineer');
  const [jobTitleError, setJobTitleError] = useState('');

  // Step 2: Your Starting Point
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Intermediate');
  const [existingSkills, setExistingSkills] = useState<string[]>(['Python', 'NumPy']);
  const [skillInput, setSkillInput] = useState('');
  const [learningGoal, setLearningGoal] = useState<LearningGoal>('become_job_ready');

  // Step 3: Your Pace
  const [dailyTime, setDailyTime] = useState<DailyCommitment>('1h');
  const [targetDuration, setTargetDuration] = useState<TargetDuration>('8 weeks');
  const [learningFormat, setLearningFormat] = useState<LearningFormat>('hands_on');
  const [resourceBudget, setResourceBudget] = useState<ResourceBudget>('free_only');

  useEffect(() => {
    if (initialCareer) {
      setJobTitle(initialCareer);
    }
  }, [initialCareer]);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !existingSkills.includes(trimmed)) {
      setExistingSkills([...existingSkills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setExistingSkills(existingSkills.filter(s => s !== skillToRemove));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!jobTitle.trim()) {
        setJobTitleError('Please enter a target career or role.');
        return;
      }
      setJobTitleError('');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      setCurrentStep(1);
      setJobTitleError('Target career is required.');
      return;
    }

    onSubmit({
      jobTitle: jobTitle.trim(),
      skillLevel,
      existingSkills,
      dailyTime,
      targetDuration,
      learningGoal,
      resourceBudget,
      learningFormat,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Editorial Step Header */}
      <div className="border-b border-stone pb-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs uppercase tracking-wider text-graphite">
            SPECIFICATION &bull; STEP 0{currentStep} OF 03
          </span>
          <span className="font-mono text-xs text-vermilion font-semibold">
            {currentStep === 1 && 'DIRECTION'}
            {currentStep === 2 && 'STARTING POINT'}
            {currentStep === 3 && 'STUDY PACE'}
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-1 rounded-full transition-colors ${currentStep >= 1 ? 'bg-vermilion' : 'bg-stone'}`} />
          <div className={`h-1 rounded-full transition-colors ${currentStep >= 2 ? 'bg-vermilion' : 'bg-stone'}`} />
          <div className={`h-1 rounded-full transition-colors ${currentStep >= 3 ? 'bg-vermilion' : 'bg-stone'}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 01 — YOUR DIRECTION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-serif text-ink tracking-tight mb-2">
                What career do you want to master?
              </h2>
              <p className="text-xs text-graphite leading-relaxed">
                Enter any profession, specialization, or niche. RoadmapAI structures custom stages for technical and non-technical fields alike.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-ink font-semibold">
                Target Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => {
                  setJobTitle(e.target.value);
                  if (jobTitleError) setJobTitleError('');
                }}
                placeholder="e.g. Frontend Developer, Site Reliability Engineer, AI Researcher..."
                className={`w-full px-4 py-3 rounded bg-white border text-sm text-ink placeholder:text-graphite-light focus:outline-none focus:ring-1 focus:ring-vermilion font-sans ${
                  jobTitleError ? 'border-vermilion' : 'border-stone'
                }`}
                autoFocus
              />
              {jobTitleError && (
                <p className="text-xs text-vermilion font-medium">{jobTitleError}</p>
              )}
            </div>

            {/* Optional Suggestions */}
            <div>
              <span className="block text-[11px] font-mono text-graphite uppercase mb-2">
                Suggested Specialties:
              </span>
              <div className="flex flex-wrap gap-2">
                {CAREER_SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setJobTitle(suggestion);
                      if (jobTitleError) setJobTitleError('');
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                      jobTitle === suggestion
                        ? 'bg-ink text-paper border-ink'
                        : 'bg-white text-ink-light border-stone hover:border-ink hover:text-ink'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 02 — YOUR STARTING POINT */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-serif text-ink tracking-tight mb-2">
                Where are you starting from?
              </h2>
              <p className="text-xs text-graphite leading-relaxed">
                This calibrates the technical depth, skipping redundant basics or providing strong foundational scaffolding.
              </p>
            </div>

            {/* Current Skill Level */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-ink font-semibold">
                Current Skill Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map(level => {
                  const isSelected = skillLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSkillLevel(level)}
                      className={`p-3.5 rounded border text-left transition-all ${
                        isSelected
                          ? 'bg-paper-tint border-vermilion shadow-subtle'
                          : 'bg-white border-stone hover:border-ink/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-ink">{level}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-vermilion" />}
                      </div>
                      <p className="text-[11px] text-graphite leading-snug">
                        {level === 'Beginner' && 'Little to no experience in this domain'}
                        {level === 'Intermediate' && 'Core fundamentals understood; need synthesis'}
                        {level === 'Advanced' && 'Working professional refining deep craft'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Existing Skills */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-ink font-semibold">
                Existing Skills (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(skillInput);
                    }
                  }}
                  placeholder="Type a skill (e.g. Git, TypeScript, SQL) and press Enter"
                  className="flex-1 px-3.5 py-2.5 rounded bg-white border border-stone text-xs text-ink placeholder:text-graphite-light focus:outline-none focus:ring-1 focus:ring-vermilion"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(skillInput)}
                  className="px-3.5 py-2.5 rounded bg-stone-light hover:bg-stone text-xs font-semibold text-ink transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {existingSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {existingSkills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-stone text-xs font-mono text-ink"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-graphite hover:text-vermilion"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Goal */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-ink font-semibold">
                Primary Learning Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'understand_fundamentals', label: 'Understand Fundamentals', desc: 'Build rock-solid theoretical intuition' },
                  { id: 'become_job_ready', label: 'Become Job-Ready', desc: 'Focus on portfolio projects, interviews & tooling' },
                  { id: 'switch_careers', label: 'Switch Careers', desc: 'Translate existing strengths to this new discipline' },
                  { id: 'improve_skills', label: 'Improve Existing Skills', desc: 'Sharpen modern best practices and advanced topics' },
                ].map(goal => {
                  const isSelected = learningGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setLearningGoal(goal.id as LearningGoal)}
                      className={`p-3 rounded border text-left transition-all ${
                        isSelected
                          ? 'bg-paper-tint border-vermilion shadow-subtle'
                          : 'bg-white border-stone hover:border-ink/50'
                      }`}
                    >
                      <div className="text-xs font-bold text-ink">{goal.label}</div>
                      <div className="text-[11px] text-graphite mt-0.5">{goal.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 03 — YOUR PACE */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-serif text-ink tracking-tight mb-2">
                Configure your pace and learning setup.
              </h2>
              <p className="text-xs text-graphite leading-relaxed">
                We calibrate lesson length and deliverables so your study stays realistic and sustainable.
              </p>
            </div>

            {/* Daily Commitment */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-ink font-semibold">
                Daily Study Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['30m', '1h', '2h', '3h'] as DailyCommitment[]).map(t => {
                  const isSelected = dailyTime === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDailyTime(t)}
                      className={`py-3 rounded border text-center font-mono font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-ink text-paper border-ink shadow-subtle'
                          : 'bg-white text-ink border-stone hover:border-ink'
                      }`}
                    >
                      {t} / day
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Timeline */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-ink font-semibold">
                Target Completion Timeline
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['4 weeks', '8 weeks', '12 weeks', '16 weeks'] as TargetDuration[]).map(d => {
                  const isSelected = targetDuration === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setTargetDuration(d)}
                      className={`py-3 rounded border text-center font-mono font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-ink text-paper border-ink shadow-subtle'
                          : 'bg-white text-ink border-stone hover:border-ink'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resource Budget & Preferred Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-ink font-semibold">
                  Resource Budget
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'free_only', label: 'Free Resources Only', sub: 'Docs, open source & free articles' },
                    { id: 'free_and_paid', label: 'Free + Paid Resources', sub: 'Include top books & premier courses' },
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setResourceBudget(b.id as ResourceBudget)}
                      className={`w-full p-2.5 rounded border text-left transition-colors ${
                        resourceBudget === b.id
                          ? 'bg-paper-tint border-vermilion'
                          : 'bg-white border-stone hover:border-ink/50'
                      }`}
                    >
                      <div className="text-xs font-bold text-ink">{b.label}</div>
                      <div className="text-[10px] text-graphite">{b.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-ink font-semibold">
                  Preferred Format
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'hands_on', label: 'Hands-on Projects', sub: 'Practical code tasks & capstones' },
                    { id: 'structured_balance', label: 'Structured Balance', sub: 'Equal theory reading & exercise' },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setLearningFormat(f.id as LearningFormat)}
                      className={`w-full p-2.5 rounded border text-left transition-colors ${
                        learningFormat === f.id
                          ? 'bg-paper-tint border-vermilion'
                          : 'bg-white border-stone hover:border-ink/50'
                      }`}
                    >
                      <div className="text-xs font-bold text-ink">{f.label}</div>
                      <div className="text-[10px] text-graphite">{f.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-6 border-t border-stone flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded border border-stone bg-white hover:bg-paper-subtle text-xs font-semibold text-ink flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded bg-ink hover:bg-ink-soft text-paper text-xs font-semibold flex items-center gap-2 transition-colors shadow-subtle"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5 text-vermilion" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-3 rounded bg-vermilion hover:bg-vermilion-dark disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 transition-all shadow-subtle"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Synthesizing Path...' : 'Generate My Learning Path'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
