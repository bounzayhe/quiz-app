
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentSection: Section | null;
  setCurrentSection: (section: Section | null) => void;
  onSave: () => void;
  editingIndex: number | null;
}

export function SectionDialog({
  isOpen,
  onOpenChange,
  currentSection,
  setCurrentSection,
  onSave,
  editingIndex,
}: SectionDialogProps) {
  const { t } = useTranslation();

  const updateSection = (updater: (section: Section) => Section) => {
    if (currentSection) {
      setCurrentSection(updater(currentSection));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingIndex !== null
              ? t('surveyBuilder.edit')
              : t('surveyBuilder.addSection')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="section-title">{t('surveyBuilder.sectionTitle')}</Label>
            <Input
              id="section-title"
              value={currentSection?.title || ''}
              onChange={(e) =>
                updateSection((prev) => ({ ...prev, title: e.target.value }))
              }
            />
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
