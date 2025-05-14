
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Company, Client, SurveyResponse } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

// Mock data
const mockCompanies: Company[] = [
  { id: '1', name: 'Acme Inc', email: 'contact@acme.com', phoneNumber: '+1234567890', representativeName: 'John Representative' },
  { id: '2', name: 'Globex Corp', email: 'info@globex.com', phoneNumber: '+1987654321', representativeName: 'Jane Manager' },
  { id: '3', name: 'Wayne Enterprises', email: 'contact@wayne.com', phoneNumber: '+1122334455', representativeName: 'Bruce Owner' },
];

const mockClients: Client[] = [
  { id: '101', name: 'Client A', email: 'clienta@example.com', companyId: '1' },
  { id: '102', name: 'Client B', email: 'clientb@example.com', companyId: '1' },
  { id: '103', name: 'Client C', email: 'clientc@example.com', companyId: '2' },
  { id: '104', name: 'Client D', email: 'clientd@example.com', companyId: '2' },
  { id: '105', name: 'Client E', email: 'cliente@example.com', companyId: '3' },
];

const mockResponses: SurveyResponse[] = [
  { id: 'r1', surveyId: 's1', clientId: '101', answers: [], totalScore: 85, completedAt: '2023-05-10T14:30:00Z' },
  { id: 'r2', surveyId: 's1', clientId: '102', answers: [], totalScore: 72, completedAt: '2023-05-12T09:15:00Z' },
  { id: 'r3', surveyId: 's2', clientId: '103', answers: [], totalScore: 93, completedAt: '2023-05-13T16:45:00Z' },
  { id: 'r4', surveyId: 's2', clientId: '104', answers: [], totalScore: 68, completedAt: '2023-05-14T11:20:00Z' },
  { id: 'r5', surveyId: 's3', clientId: '105', answers: [], totalScore: 79, completedAt: '2023-05-15T10:10:00Z' },
];

export default function CompaniesPage() {
  const { t } = useTranslation();
  const [companies] = useState<Company[]>(mockCompanies);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPp');
  };
  
  const getClientsForCompany = (companyId: string) => {
    return mockClients.filter(client => client.companyId === companyId);
  };
  
  const getResponseForClient = (clientId: string) => {
    return mockResponses.find(response => response.clientId === clientId);
  };
  
  const toggleCompany = (companyId: string) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('companies.title')}</h1>
        <Button>{t('companies.addCompany')}</Button>
      </div>
      
      <div className="space-y-4">
        {companies.map((company) => (
          <Card key={company.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 cursor-pointer" onClick={() => toggleCompany(company.id)}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{company.name}</CardTitle>
                  <CardDescription>{company.email} • {company.phoneNumber}</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  {expandedCompany === company.id ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardHeader>
            
            {expandedCompany === company.id && (
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">{t('companies.clients')}</h3>
                
                <div className="space-y-4">
                  {getClientsForCompany(company.id).map((client) => {
                    const response = getResponseForClient(client.id);
                    
                    return (
                      <div key={client.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{client.name}</h4>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                          
                          {response && (
                            <div className="flex items-center gap-4">
                              <Badge className={getScoreColor(response.totalScore)}>
                                {t('companies.score')}: {response.totalScore}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(response.completedAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
