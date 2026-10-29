import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WeeklyAssessmentRunner } from '../components/assessment/WeeklyAssessmentRunner';

export const WeeklyAssessmentPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-4 pb-16">
      <WeeklyAssessmentRunner
        onContinue={() => navigate('/dashboard')}
        onOpenRevision={() => navigate('/progress')}
      />
    </div>
  );
};
