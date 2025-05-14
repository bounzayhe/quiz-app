
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Answer } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface AnswerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAnswer: Answer | null;
  setCurrentAnswer: (answer: Answer | null) => void;
  onSave: () => void;
  editingIndex: number | null;
}

export function AnswerDialog({
  isOpen,
  onOpenChange,
  currentAnswer,
  setCurrentAnswer,
  onSave,
  editingIndex,
}: AnswerDialogProps) {
  const { t } = useTranslation();

  const updateAnswer = (updater: (answer: Answer) => Answer) => {
    if (currentAnswer) {
      setCurrentAnswer(updater(currentAnswer));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingIndex !== null
              ? t('surveyBuilder.edit')
              : t('surveyBuilder.addAnswer')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="answer-text">{t('surveyBuilder.answerText')}</Label>
              <Input
                id="answer-text"
                value={currentAnswer?.text || ''}
                onChange={(e) =>
                  updateAnswer((prev) => ({ ...prev, text: e.target.value }))
                }
              />
            </div>
            <div className="w-24 space-y-2">
              <Label htmlFor="answer-score">{t('surveyBuilder.score')}</Label>
              <Input
                id="answer-score"
                type="number"
                min={0}
                value={currentAnswer?.score || 0}
                onChange={(e) =>
                  updateAnswer((prev) => ({ ...prev, score: Number(e.target.value) || 0 }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer-explanation">{t('surveyBuilder.explanation')}</Label>
            <Textarea
              id="answer-explanation"
              value={currentAnswer?.explanation || ''}
              onChange={(e) =>
                updateAnswer((prev) => ({ ...prev, explanation: e.target.value }))
              }
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer-detail">{t('surveyBuilder.detail')}</Label>
            <Textarea
              id="answer-detail"
              value={currentAnswer?.detail || ''}
              onChange={(e) =>
                updateAnswer((prev) => ({ ...prev, detail: e.target.value }))
              }
              rows={2}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('surveyBuilder.cancel')}
          </Button>
          <Button onClick={onSave}>{t('surveyBuilder.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
