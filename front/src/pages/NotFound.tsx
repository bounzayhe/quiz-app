
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          {t('common.error')}
        </p>
        <Button onClick={() => navigate('/')}>
          {t('common.goBack')}
        </Button>
      </div>
    </div>
  );
}
