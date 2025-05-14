
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Section, Company } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface SurveySummaryStepProps {
  companyInfo: Partial<Company>;
  sections: Section[];
  onPrevious: () => void;
  onGenerate: () => void;
}

export default function SurveySummaryStep({
  companyInfo,
  sections,
  onPrevious,
  onGenerate,
}: SurveySummaryStepProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleGenerateSurvey = () => {
    // In a real application, you would send the survey data to your backend here
    console.log('Generating survey with data:', {
      companyInfo,
      sections,
    });
    
    // Show success toast
    toast({
      title: t('common.success'),
      description: t('surveyBuilder.generateSurvey') + ' ' + t('common.success').toLowerCase(),
    });
    
    // Call the passed onGenerate function
    onGenerate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('surveyBuilder.step3')}</h2>
        <p className="text-muted-foreground">{t('surveyBuilder.summary')}</p>
      </div>

      <div className="space-y-6">
        {/* Company Information Summary */}
        <div className="border rounded-md p-6 bg-muted/20">
          <h3 className="text-xl font-bold mb-4">{t('surveyBuilder.step1')}</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium text-muted-foreground">{t('surveyBuilder.companyName')}</dt>
              <dd>{companyInfo.name}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">{t('surveyBuilder.email')}</dt>
              <dd>{companyInfo.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">{t('surveyBuilder.phoneNumber')}</dt>
              <dd>{companyInfo.phoneNumber}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">{t('surveyBuilder.representativeName')}</dt>
              <dd>{companyInfo.representativeName}</dd>
            </div>
          </dl>

          {companyInfo.logo && (
            <div className="mt-4">
              <h4 className="font-medium text-muted-foreground mb-2">{t('surveyBuilder.logo')}</h4>
              <img
                src={companyInfo.logo}
                alt={companyInfo.name}
                className="h-16 object-contain"
              />
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-muted-foreground mb-2">{t('surveyBuilder.primaryColor')}</h4>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: companyInfo.primaryColor }}
                ></div>
                <span>{companyInfo.primaryColor}</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-muted-foreground mb-2">{t('surveyBuilder.secondaryColor')}</h4>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: companyInfo.secondaryColor }}
                ></div>
                <span>{companyInfo.secondaryColor}</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-muted-foreground mb-2">{t('surveyBuilder.backgroundColor')}</h4>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: companyInfo.backgroundColor }}
                ></div>
                <span>{companyInfo.backgroundColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Sections Summary */}
        <div className="border rounded-md p-6">
          <h3 className="text-xl font-bold mb-4">{t('surveyBuilder.step2')}</h3>
          
          <Accordion type="multiple" className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <AccordionItem key={section.id} value={section.id} className="border rounded-md overflow-hidden">
                <AccordionTrigger className="px-4 py-2 bg-muted/20">
                  <span className="font-medium highlight">
                    {section.title || `${t('surveyBuilder.sectionTitle')} ${sectionIndex + 1}`}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-2">
                  {section.image && (
                    <div className="mb-4">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="h-32 object-contain rounded-md"
                      />
                    </div>
                  )}
                  
                  <h4 className="font-medium mb-2">{t('surveyBuilder.questions')}</h4>
                  {section.questions.length > 0 ? (
                    <ol className="list-decimal pl-5 space-y-4">
                      {section.questions.map((question) => (
                        <li key={question.id}>
                          <div className="highlight font-medium">{question.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {question.type === 'radio' ? t('surveyBuilder.radio') : t('surveyBuilder.text')}
                          </div>
                          
                          {question.type === 'radio' && question.answers.length > 0 && (
                            <div className="mt-2">
                              <h5 className="text-sm font-medium mb-1">{t('surveyBuilder.answers')}</h5>
                              <ul className="list-disc pl-5 space-y-1">
                                {question.answers.map((answer) => (
                                  <li key={answer.id} className="text-sm">
                                    <span>{answer.text}</span>
                                    <span className="ml-2 text-muted-foreground">
                                      ({answer.score} {t('surveyBuilder.score')})
                                    </span>
                                    
                                    {(answer.explanation || answer.detail) && (
                                      <div className="ml-2 mt-1 text-xs text-muted-foreground">
                                        {answer.explanation && (
                                          <div>
                                            <span className="font-medium">{t('surveyBuilder.explanation')}:</span> {answer.explanation}
                                          </div>
                                        )}
                                        {answer.detail && (
                                          <div>
                                            <span className="font-medium">{t('surveyBuilder.detail')}:</span> {answer.detail}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      {t('surveyBuilder.noQuestions')}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          {t('surveyBuilder.previous')}
        </Button>
        <Button onClick={handleGenerateSurvey}>{t('surveyBuilder.generateSurvey')}</Button>
      </div>
    </div>
  );
}
