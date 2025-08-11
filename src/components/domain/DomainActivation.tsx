import { useState, useEffect } from "react";
import { CheckCircle, Globe, Shield, Zap, Monitor, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DomainActivationProps {
  domain: string;
  onNext: () => void;
  onBack: () => void;
}

interface ActivationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  progress: number;
}

export const DomainActivation = ({ domain, onNext, onBack }: DomainActivationProps) => {
  const [activationSteps, setActivationSteps] = useState<ActivationStep[]>([
    {
      id: 'dns',
      title: 'Validation DNS',
      description: 'Vérification de la configuration DNS',
      status: 'pending',
      progress: 0
    },
    {
      id: 'ssl',
      title: 'Génération SSL',
      description: 'Création du certificat SSL/TLS',
      status: 'pending',
      progress: 0
    },
    {
      id: 'deployment',
      title: 'Déploiement',
      description: 'Mise en ligne de votre site',
      status: 'pending',
      progress: 0
    },
    {
      id: 'optimization',
      title: 'Optimisation',
      description: 'Configuration CDN et cache',
      status: 'pending',
      progress: 0
    }
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const updateStepProgress = (stepId: string, progress: number, status: ActivationStep['status']) => {
    setActivationSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, progress, status } : step
      )
    );
  };

  const startActivation = async () => {
    const steps = ['dns', 'ssl', 'deployment', 'optimization'];
    
    for (let i = 0; i < steps.length; i++) {
      const stepId = steps[i];
      
      // Marquer comme en cours
      updateStepProgress(stepId, 0, 'processing');
      
      // Simuler le progrès
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        updateStepProgress(stepId, progress, 'processing');
        setOverallProgress(((i * 100) + progress) / steps.length);
      }
      
      // Marquer comme terminé
      updateStepProgress(stepId, 100, 'completed');
    }
    
    setIsCompleted(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startActivation();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getStepIcon = (step: ActivationStep) => {
    switch (step.id) {
      case 'dns': return <Globe className="h-5 w-5" />;
      case 'ssl': return <Shield className="h-5 w-5" />;
      case 'deployment': return <Zap className="h-5 w-5" />;
      case 'optimization': return <Monitor className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Activation en cours</h2>
        <p className="text-muted-foreground">
          Finalisation de la configuration pour <span className="font-medium text-foreground">{domain}</span>
        </p>
      </div>

      {/* Overall progress */}
      <Card className="border-primary bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progression globale</span>
            <Badge variant={isCompleted ? "default" : "secondary"} className="bg-primary">
              {Math.round(overallProgress)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {isCompleted 
              ? "Configuration terminée avec succès !" 
              : "Configuration en cours, veuillez patienter..."
            }
          </p>
        </CardContent>
      </Card>

      {/* Activation steps */}
      <div className="space-y-4">
        {activationSteps.map((step) => (
          <Card 
            key={step.id}
            className={`border transition-all duration-300 ${
              step.status === 'completed' 
                ? 'border-success bg-success/10' 
                : step.status === 'processing'
                ? 'border-primary bg-primary/10'
                : 'border-border'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 ${
                  step.status === 'completed' 
                    ? 'text-success' 
                    : step.status === 'processing'
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}>
                  {step.status === 'processing' ? (
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : step.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    getStepIcon(step)
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{step.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {step.status === 'completed' ? 'Terminé' : 
                       step.status === 'processing' ? `${step.progress}%` : 'En attente'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  {step.status === 'processing' && (
                    <Progress value={step.progress} className="h-2" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Success message */}
      {isCompleted && (
        <Alert className="border-success bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription>
            <strong>Félicitations !</strong> Votre domaine {domain} est maintenant actif et sécurisé. 
            Votre site est accessible via HTTPS avec un certificat SSL valide.
          </AlertDescription>
        </Alert>
      )}

      {/* Site info */}
      {isCompleted && (
        <Card className="border-success bg-gradient-to-br from-success/10 to-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <Globe className="h-5 w-5" />
              Votre site est en ligne !
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Site web :</span>
                <Button variant="link" className="h-auto p-0">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  https://{domain}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Certificat SSL :</span>
                <Badge variant="outline" className="border-success text-success">
                  Actif
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">CDN :</span>
                <Badge variant="outline" className="border-success text-success">
                  Configuré
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={!isCompleted}>
          Retour
        </Button>
        <Button 
          onClick={onNext}
          disabled={!isCompleted}
          className="flex-1 bg-gradient-to-r from-success to-success hover:opacity-90"
        >
          {isCompleted ? 'Continuer vers la gestion' : 'Activation en cours...'}
        </Button>
      </div>
    </div>
  );
};