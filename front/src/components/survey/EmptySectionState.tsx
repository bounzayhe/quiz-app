
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle } from 'lucide-react';

export function EmptySectionState() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-md">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <PlusCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">{t('surveyBuilder.noSections')}</h3>
      <p className="text-muted-foreground mb-4">{t('surveyBuilder.addSectionPrompt')}</p>
    </div>
  );
}
