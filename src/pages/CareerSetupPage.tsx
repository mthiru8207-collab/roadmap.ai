import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CareerSetupForm } from '../components/career/CareerSetupForm';
import { GeneratingScreen } from '../components/career/GeneratingScreen';
import { useLearning } from '../context/LearningContext';
import { UserPreferences } from '../types';

export const CareerSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { createRoadmap, isGenerating } = useLearning();
  const [submittedPref, setSubmittedPref] = React.useState<UserPreferences | null>(null);

  const handleSubmit = async (preferences: UserPreferences) => {
    setSubmittedPref(preferences);
    try {
      await createRoadmap(preferences);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create roadmap:', err);
    }
  };

  if (isGenerating && submittedPref) {
    return (
      <GeneratingScreen
        jobTitle={submittedPref.jobTitle}
        skillLevel={submittedPref.skillLevel}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="text-center space-y-2 pb-2">
        <div className="inline-block text-[10px] font-mono uppercase tracking-widest text-vermilion font-bold">
          INSTRUMENT CALIBRATION
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight">
          Design your career roadmap
        </h1>
        <p className="text-xs sm:text-sm text-graphite max-w-md mx-auto">
          Specify your direction, current background, and time commitment. We compile an ordered 4-stage technical syllabus.
        </p>
      </div>

      <CareerSetupForm onSubmit={handleSubmit} isSubmitting={isGenerating} />
    </div>
  );
};
