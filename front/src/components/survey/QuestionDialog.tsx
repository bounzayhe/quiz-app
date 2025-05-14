
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Question } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface QuestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentQuestion: Question | null;
  setCurrentQuestion: (question: Question | null) => void;
  onSave: () => void;
  editingIndex: number | null;
}

export function QuestionDialog({
  isOpen,
  onOpenChange,
  currentQuestion,
  setCurrentQuestion,
  onSave,
  editingIndex,
}: QuestionDialogProps) {
  const { t } = useTranslation();

  const updateQuestion = (updater: (question: Question) => Question) => {
    if (currentQuestion) {
      setCurrentQuestion(updater(currentQuestion));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingIndex !== null
              ? t('surveyBuilder.edit')
              : t('surveyBuilder.addQuestion')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="question-title">{t('surveyBuilder.questionTitle')}</Label>
            <Input
              id="question-title"
              value={currentQuestion?.title || ''}
              onChange={(e) =>
                updateQuestion((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="question-type">{t('surveyBuilder.questionType')}</Label>
            <Select
              value={currentQuestion?.type || 'radio'}
              onValueChange={(value) =>
                updateQuestion((prev) => ({
                  ...prev,
                  type: value as 'radio' | 'text',
                  answers: value === 'text' ? [] : prev.answers,
                }))
              }
            >
              <SelectTrigger id="question-type">
                <SelectValue placeholder={t('surveyBuilder.questionType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="radio">{t('surveyBuilder.radio')}</SelectItem>
                <SelectItem value="text">{t('surveyBuilder.text')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('surveyBuilder.cancel')}
          </Button>
          <Button onClick={onSave}>{t('surveyBuilder.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
