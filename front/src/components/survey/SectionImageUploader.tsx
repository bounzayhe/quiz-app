
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectionImageUploaderProps {
  image?: string;
  onImageChange: (sectionIndex: number, imageBase64: string) => void;
  sectionIndex: number;
  onImageRemove: (sectionIndex: number) => void;
}

export function SectionImageUploader({ 
  image, 
  onImageChange, 
  sectionIndex, 
  onImageRemove 
}: SectionImageUploaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4">
      {image ? (
        <div className="relative h-24 w-40">
          <img
            src={image}
            alt="Section image"
            className="h-full w-full object-cover rounded-md"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full p-0 bg-white text-gray-700"
            onClick={() => onImageRemove(sectionIndex)}
          >
            ×
          </Button>
        </div>
      ) : (
        <div className="h-24 w-40 border-2 border-dashed rounded-md flex items-center justify-center">
          <label className="cursor-pointer flex flex-col items-center justify-center text-sm text-muted-foreground">
            <ImagePlus size={20} className="mb-1" />
            {t('surveyBuilder.uploadImage')}
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onImageChange(
                      sectionIndex,
                      reader.result as string
                    );
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
      )}
      <div>
        <h3 className="font-medium">{t('surveyBuilder.imageUpload')}</h3>
        <p className="text-sm text-muted-foreground">
          {image
            ? t('surveyBuilder.image')
            : t('surveyBuilder.uploadImage')}
        </p>
      </div>
    </div>
  );
}
