
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { SectionImageUploader } from './SectionImageUploader';
import { QuestionItem } from './QuestionItem';

interface SectionCardProps {
  section: Section;
  sectionIndex: number;
  onEditSection: (sectionIndex: number) => void;
  onDeleteSection: (sectionIndex: number) => void;
  onAddQuestion: (sectionIndex: number) => void;
  onEditQuestion: (sectionIndex: number, questionIndex: number) => void;
  onDeleteQuestion: (sectionIndex: number, questionIndex: number) => void;
  onAddAnswer: (sectionIndex: number, questionIndex: number) => void;
  onEditAnswer: (sectionIndex: number, questionIndex: number, answerIndex: number) => void;
  onDeleteAnswer: (sectionIndex: number, questionIndex: number, answerIndex: number) => void;
  onImageUpload: (sectionIndex: number, imageBase64: string) => void;
  onImageRemove: (sectionIndex: number) => void;
}

export function SectionCard({
  section,
  sectionIndex,
  onEditSection,
  onDeleteSection,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onAddAnswer,
  onEditAnswer,
  onDeleteAnswer,
  onImageUpload,
  onImageRemove,
}: SectionCardProps) {
  const { t } = useTranslation();

  return (
    <Card key={section.id} className="border">
      <CardHeader className="bg-muted/30 flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">
            {sectionIndex + 1}. {section.title || t('surveyBuilder.sectionTitle')}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditSection(sectionIndex)}
            className="icon-button"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteSection(sectionIndex)}
            className="icon-button text-destructive hover:text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Section Image */}
        <SectionImageUploader 
          image={section.image} 
          sectionIndex={sectionIndex}
          onImageChange={onImageUpload}
          onImageRemove={onImageRemove}
        />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{t('surveyBuilder.questions')}</h3>
            <Button
              variant="default"
              size="sm"
              className="text-white hover:bg-primary/90"
              onClick={() => onAddQuestion(sectionIndex)}
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              {t('surveyBuilder.addQuestion')}
            </Button>
          </div>

          <div className="space-y-3">
            {section.questions.map((question, questionIndex) => (
              <QuestionItem
                key={question.id}
                question={question}
                questionIndex={questionIndex}
                sectionIndex={sectionIndex}
                onEditQuestion={onEditQuestion}
                onDeleteQuestion={onDeleteQuestion}
                onAddAnswer={onAddAnswer}
                onEditAnswer={onEditAnswer}
                onDeleteAnswer={onDeleteAnswer}
              />
            ))}
          </div>

          {section.questions.length === 0 && (
            <p className="text-sm text-muted-foreground italic p-3 border rounded-md">
              {t('surveyBuilder.noQuestions')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
