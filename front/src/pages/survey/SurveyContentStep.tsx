
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Section, Question, Answer } from '@/lib/types';
import { SectionDialog } from '@/components/survey/SectionDialog';
import { QuestionDialog } from '@/components/survey/QuestionDialog';
import { AnswerDialog } from '@/components/survey/AnswerDialog';
import { SectionCard } from '@/components/survey/SectionCard';
import { EmptySectionState } from '@/components/survey/EmptySectionState';

interface SurveyContentStepProps {
  initialSections?: Section[];
  onNext: (sections: Section[]) => void;
  onPrevious: () => void;
}

export default function SurveyContentStep({
  initialSections = [],
  onNext,
  onPrevious,
}: SurveyContentStepProps) {
  const { t } = useTranslation();
  const [sections, setSections] = useState<Section[]>(initialSections);

  // Section dialog state
  const [isSectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

  // Question dialog state
  const [isQuestionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  // Answer dialog state
  const [isAnswerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [editingAnswerIndex, setEditingAnswerIndex] = useState<number | null>(null);

  // Section handlers
  const openAddSectionDialog = () => {
    setCurrentSection({
      id: nanoid(),
      title: '',
      questions: [],
    });
    setEditingSectionIndex(null);
    setSectionDialogOpen(true);
  };

  const openEditSectionDialog = (sectionIndex: number) => {
    setCurrentSection({ ...sections[sectionIndex] });
    setEditingSectionIndex(sectionIndex);
    setSectionDialogOpen(true);
  };

  const handleSectionSave = () => {
    if (!currentSection) return;

    if (editingSectionIndex !== null) {
      // Update existing section
      const newSections = [...sections];
      newSections[editingSectionIndex] = currentSection;
      setSections(newSections);
    } else {
      // Add new section
      setSections([...sections, currentSection]);
    }

    setSectionDialogOpen(false);
    setCurrentSection(null);
    setEditingSectionIndex(null);
  };

  const handleDeleteSection = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections.splice(sectionIndex, 1);
    setSections(newSections);
  };

  // Question handlers
  const openAddQuestionDialog = (sectionIndex: number) => {
    setCurrentQuestion({
      id: nanoid(),
      title: '',
      type: 'radio',
      answers: [],
    });
    setCurrentSectionIndex(sectionIndex);
    setEditingQuestionIndex(null);
    setQuestionDialogOpen(true);
  };

  const openEditQuestionDialog = (sectionIndex: number, questionIndex: number) => {
    setCurrentQuestion({ ...sections[sectionIndex].questions[questionIndex] });
    setCurrentSectionIndex(sectionIndex);
    setEditingQuestionIndex(questionIndex);
    setQuestionDialogOpen(true);
  };

  const handleQuestionSave = () => {
    if (!currentQuestion || currentSectionIndex === null) return;

    const newSections = [...sections];
    const sectionQuestions = [...newSections[currentSectionIndex].questions];

    if (editingQuestionIndex !== null) {
      // Update existing question
      sectionQuestions[editingQuestionIndex] = currentQuestion;
    } else {
      // Add new question
      sectionQuestions.push(currentQuestion);
    }

    newSections[currentSectionIndex] = {
      ...newSections[currentSectionIndex],
      questions: sectionQuestions,
    };

    setSections(newSections);
    setQuestionDialogOpen(false);
    setCurrentQuestion(null);
    setCurrentSectionIndex(null);
    setEditingQuestionIndex(null);
  };

  const handleDeleteQuestion = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.splice(questionIndex, 1);
    setSections(newSections);
  };

  // Answer handlers
  const openAddAnswerDialog = (sectionIndex: number, questionIndex: number) => {
    if (sections[sectionIndex].questions[questionIndex].type !== 'radio') return;

    setCurrentAnswer({
      id: nanoid(),
      text: '',
      score: 0,
    });
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuestionIndex(questionIndex);
    setEditingAnswerIndex(null);
    setAnswerDialogOpen(true);
  };

  const openEditAnswerDialog = (sectionIndex: number, questionIndex: number, answerIndex: number) => {
    setCurrentAnswer({ ...sections[sectionIndex].questions[questionIndex].answers[answerIndex] });
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuestionIndex(questionIndex);
    setEditingAnswerIndex(answerIndex);
    setAnswerDialogOpen(true);
  };

  const handleAnswerSave = () => {
    if (!currentAnswer || currentSectionIndex === null || currentQuestionIndex === null) return;

    const newSections = [...sections];
    const questionAnswers = [...newSections[currentSectionIndex].questions[currentQuestionIndex].answers];

    if (editingAnswerIndex !== null) {
      // Update existing answer
      questionAnswers[editingAnswerIndex] = currentAnswer;
    } else {
      // Add new answer
      questionAnswers.push(currentAnswer);
    }

    newSections[currentSectionIndex].questions[currentQuestionIndex].answers = questionAnswers;

    setSections(newSections);
    setAnswerDialogOpen(false);
    setCurrentAnswer(null);
    setCurrentSectionIndex(null);
    setCurrentQuestionIndex(null);
    setEditingAnswerIndex(null);
  };

  const handleDeleteAnswer = (sectionIndex: number, questionIndex: number, answerIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].answers.splice(answerIndex, 1);
    setSections(newSections);
  };

  // Handlers for image upload
  const handleSectionImageUpload = (sectionIndex: number, imageBase64: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].image = imageBase64;
    setSections(newSections);
  };

  const handleSectionImageRemove = (sectionIndex: number) => {
    const newSections = [...sections];
    delete newSections[sectionIndex].image;
    setSections(newSections);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('surveyBuilder.step2')}</h2>
        <p className="text-muted-foreground">{t('surveyBuilder.sections')}</p>
      </div>

      {sections.length > 0 ? (
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <SectionCard
              key={section.id}
              section={section}
              sectionIndex={sectionIndex}
              onEditSection={openEditSectionDialog}
              onDeleteSection={handleDeleteSection}
              onAddQuestion={openAddQuestionDialog}
              onEditQuestion={openEditQuestionDialog}
              onDeleteQuestion={handleDeleteQuestion}
              onAddAnswer={openAddAnswerDialog}
              onEditAnswer={openEditAnswerDialog}
              onDeleteAnswer={handleDeleteAnswer}
              onImageUpload={handleSectionImageUpload}
              onImageRemove={handleSectionImageRemove}
            />
          ))}
        </div>
      ) : (
        <EmptySectionState />
      )}

      <Button 
        onClick={openAddSectionDialog} 
        className="bg-primary text-white hover:bg-primary/90"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        {t('surveyBuilder.addSection')}
      </Button>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          {t('surveyBuilder.previous')}
        </Button>
        <Button onClick={() => onNext(sections)}>
          {t('surveyBuilder.next')}
        </Button>
      </div>

      {/* Dialogs */}
      <SectionDialog
        isOpen={isSectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        onSave={handleSectionSave}
        editingIndex={editingSectionIndex}
      />

      <QuestionDialog
        isOpen={isQuestionDialogOpen}
        onOpenChange={setQuestionDialogOpen}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        onSave={handleQuestionSave}
        editingIndex={editingQuestionIndex}
      />

      <AnswerDialog
        isOpen={isAnswerDialogOpen}
        onOpenChange={setAnswerDialogOpen}
        currentAnswer={currentAnswer}
        setCurrentAnswer={setCurrentAnswer}
        onSave={handleAnswerSave}
        editingIndex={editingAnswerIndex}
      />
    </div>
  );
}
