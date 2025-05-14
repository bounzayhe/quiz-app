
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Question, Answer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

interface QuestionItemProps {
  question: Question;
  questionIndex: number;
  sectionIndex: number;
  onEditQuestion: (sectionIndex: number, questionIndex: number) => void;
  onDeleteQuestion: (sectionIndex: number, questionIndex: number) => void;
  onAddAnswer: (sectionIndex: number, questionIndex: number) => void;
  onEditAnswer: (sectionIndex: number, questionIndex: number, answerIndex: number) => void;
  onDeleteAnswer: (sectionIndex: number, questionIndex: number, answerIndex: number) => void;
}

export function QuestionItem({
  question,
  questionIndex,
  sectionIndex,
  onEditQuestion,
  onDeleteQuestion,
  onAddAnswer,
  onEditAnswer,
  onDeleteAnswer,
}: QuestionItemProps) {
  const { t } = useTranslation();

  return (
    <div className="border rounded-md p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-base font-medium">
              {sectionIndex + 1}.{questionIndex + 1}. {question.title || t('surveyBuilder.questionTitle')}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {question.type === 'radio'
                ? t('surveyBuilder.radio')
                : t('surveyBuilder.text')}
              {question.type === 'radio' &&
                ` · ${question.answers.length} ${t('surveyBuilder.answers')}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditQuestion(sectionIndex, questionIndex)}
            className="icon-button"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteQuestion(sectionIndex, questionIndex)}
            className="icon-button text-destructive hover:text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {question.type === 'radio' && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">
              {t('surveyBuilder.answers')}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
              onClick={() => onAddAnswer(sectionIndex, questionIndex)}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              {t('surveyBuilder.addAnswer')}
            </Button>
          </div>

          {question.answers.length > 0 ? (
            <ul className="space-y-2 pl-6 list-disc">
              {question.answers.map((answer: Answer, answerIndex: number) => (
                <AnswerListItem 
                  key={answer.id}
                  answer={answer}
                  answerIndex={answerIndex}
                  questionIndex={questionIndex}
                  sectionIndex={sectionIndex}
                  onEditAnswer={onEditAnswer}
                  onDeleteAnswer={onDeleteAnswer}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {t('surveyBuilder.noAnswers')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface AnswerListItemProps {
  answer: Answer;
  answerIndex: number;
  questionIndex: number;
  sectionIndex: number;
  onEditAnswer: (sectionIndex: number, questionIndex: number, answerIndex: number) => void;
  onDeleteAnswer: (sectionIndex: number, questionIndex: number, answerIndex: number) => void;
}

function AnswerListItem({
  answer,
  answerIndex,
  questionIndex,
  sectionIndex,
  onEditAnswer,
  onDeleteAnswer,
}: AnswerListItemProps) {
  const { t } = useTranslation();

  return (
    <li key={answer.id} className="text-sm">
      <div className="flex items-center justify-between">
        <div>
          <span>{answer.text}</span>
          <span className="ml-2 text-muted-foreground">
            ({answer.score} {t('surveyBuilder.score')})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onEditAnswer(
                sectionIndex,
                questionIndex,
                answerIndex
              )
            }
            className="icon-button h-6 w-6"
          >
            <Pencil size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onDeleteAnswer(
                sectionIndex,
                questionIndex,
                answerIndex
              )
            }
            className="icon-button h-6 w-6 text-destructive hover:text-destructive"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
    </li>
  );
}
