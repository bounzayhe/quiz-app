
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { Check, ChevronDown, ChevronUp, Loader2, UserPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client, SurveyResponse } from '@/lib/types';

const clientSchema = z.object({
  fullname: z.string().min(3, {
    message: "Client name must be at least 3 characters",
  }),
});

export default function CompanyDashboardPage() {
  const { t } = useTranslation();
  const [expandedClient, setExpandedClient] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  
  // Format date with consistent format
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPpp');
  };

  // Fetch client responses from API
  const { data: clientResponses, isLoading } = useQuery({
    queryKey: ['clientResponses'],
    queryFn: api.getClientResponses,
  });
  
  // Register new client mutation
  const registerMutation = useMutation({
    mutationFn: (fullname: string) => api.registerClient(fullname),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Client registered successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['clientResponses'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: 'Error',
        description: error.message || 'Failed to register client',
      });
    },
  });
  
  // Client registration form
  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullname: "",
    },
  });
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof clientSchema>) => {
    registerMutation.mutate(values.fullname);
    form.reset();
  };

  const toggleClientExpansion = (clientId: string) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">{t('companyDashboard.title')}</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              {t('companyDashboard.registerClient')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('companyDashboard.registerClient')}</DialogTitle>
              <DialogDescription>
                Enter the client's full name to register them.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      'Register Client'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : clientResponses && clientResponses.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{t('companyDashboard.clients')}</CardTitle>
              <CardDescription>
                View all client responses and survey results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientResponses.map((response) => (
                  <div key={response.id} className="border rounded-md overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer"
                      onClick={() => toggleClientExpansion(response.clientId)}
                    >
                      <div>
                        <div className="font-medium">{response.clientName || `Client ${response.clientId}`}</div>
                        <div className="text-sm text-muted-foreground">
                          Survey completed: {formatDate(response.completedAt)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getScoreColor(response.totalScore)}>
                          {response.totalScore}
                        </Badge>
                        
                        <div className="h-8 w-8 rounded-full flex items-center justify-center">
                          {expandedClient === response.clientId ? <ChevronUp /> : <ChevronDown />}
                        </div>
                      </div>
                    </div>
                    
                    {expandedClient === response.clientId && (
                      <div className="p-4">
                        <div className="space-y-6">
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-4">{t('companies.surveyResults')}</h4>
                            <div className="flex items-center mb-4">
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${response.totalScore}%` }}
                                ></div>
                              </div>
                              <span className="ml-4 font-medium text-lg">{response.totalScore}%</span>
                            </div>
                            
                            {/* Display detailed answers */}
                            {response.answers && response.answers.length > 0 && (
                              <div className="space-y-4 mt-6">
                                <h5 className="text-sm font-medium text-muted-foreground">Detailed Responses</h5>
                                {response.answers.map((answer, index) => (
                                  <div key={index} className="border rounded-md p-3 bg-muted/10">
                                    <div className="font-medium">{answer.questionTitle || `Question ${index + 1}`}</div>
                                    <div className="text-sm mt-1">{answer.response}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No client responses found.</p>
            <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['clientResponses'] })}>
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
