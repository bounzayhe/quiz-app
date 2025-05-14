
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '@/components/survey/ProgressBar';
import CompanyInfoStep from '@/pages/survey/CompanyInfoStep';
import SurveyContentStep from '@/pages/survey/SurveyContentStep';
import SurveySummaryStep from '@/pages/survey/SurveySummaryStep';
import { Section, Company } from '@/lib/types';

export default function SurveyBuilderPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [companyInfo, setCompanyInfo] = useState<Partial<Company>>({});
  const [sections, setSections] = useState<Section[]>([]);

  const steps = [
    'Company Information', 
    'Survey Content', 
    'Summary'
  ];

  const handleNextStep = (step: number, data?: any) => {
    if (step === 0 && data) {
      setCompanyInfo(data);
    } else if (step === 1 && data) {
      setSections(data);
    }
    
    setCurrentStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousStep = (step: number) => {
    setCurrentStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSurveyGeneration = () => {
    // After successful survey generation, redirect to companies page
    navigate('/companies');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Survey Builder</h1>
      
      <ProgressBar 
        steps={steps}
        currentStep={currentStep}
        onChange={(step) => setCurrentStep(step)}
      />
      
      <div className="border rounded-md p-6 bg-white">
        {currentStep === 0 && (
          <CompanyInfoStep 
            initialData={companyInfo} 
            onNext={(data) => handleNextStep(0, data)} 
          />
        )}
        
        {currentStep === 1 && (
          <SurveyContentStep 
            initialSections={sections}
            onNext={(data) => handleNextStep(1, data)}
            onPrevious={() => handlePreviousStep(1)}
          />
        )}
        
        {currentStep === 2 && (
          <SurveySummaryStep
            companyInfo={companyInfo}
            sections={sections}
            onPrevious={() => handlePreviousStep(2)}
            onGenerate={handleSurveyGeneration}
          />
        )}
      </div>
    </div>
  );
}
