import { useState, useEffect } from "react";
import { Shield, AlertCircle, CheckCircle, Globe, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DomainVerificationProps {
  domain: string;
  isOwned: boolean;
  onNext: () => void;
  onBack: () => void;
}

interface VerificationStep {
  id: string;
  title: string;
  status: 'pending' | 'success' | 'error';
  description: string;
}

export const DomainVerification = ({ domain, isOwned, onNext, onBack }: DomainVerificationProps) => {
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
      id: 'availability',
      title: isOwned ? 'Vérification de propriété' : 'Vérification de disponibilité',
      status: 'pending',
      description: isOwned ? 'Vérification que vous possédez ce domaine' : 'Vérification que le domaine est disponible'
    },
    {
      id: 'conflicts',
      title: 'Vérification des conflits',
      status: 'pending',
      description: 'Vérification que le domaine n\'est pas déjà utilisé'
    }
  ]);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const { toast } = useToast();

  const updateStepStatus = (stepId: string, status: 'pending' | 'success' | 'error') => {
    setVerificationSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const startVerification = async () => {
    setIsVerifying(true);
    
    // Simuler la vérification étape par étape
    for (const step of verificationSteps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler des résultats (en réalité, vous appelleriez vos APIs)
      const success = Math.random() > 0.2; // 80% de succès
      updateStepStatus(step.id, success ? 'success' : 'error');
      
      if (!success) {
        setIsVerifying(false);
        return;
      }
    }
    
    setIsVerifying(false);
    setCanProceed(true);
    toast({
      title: "Vérification réussie",
      description: "Votre domaine est prêt à être configuré"
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "L'information a été copiée dans le presse-papier"
    });
  };

  useEffect(() => {
    // Auto-start verification after component mount
    const timer = setTimeout(() => {
      startVerification();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Vérification du domaine</h2>
        <p className="text-muted-foreground">
          Vérification de votre domaine : <span className="font-medium text-foreground">{domain}</span>
        </p>
      </div>

      {/* Domain info card */}
      <Card className="border-border bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Informations du domaine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Domaine :</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{domain}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(domain)}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Type :</span>
            <Badge variant={isOwned ? "outline" : "secondary"}>
              {isOwned ? "Domaine existant" : "Nouveau domaine"}
            </Badge>
          </div>
          {!isOwned && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Prix estimé :</span>
              <span className="font-semibold text-success">12.99€/an</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification steps */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Étapes de vérification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationSteps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                step.status === 'success' && "border-success bg-success/10",
                step.status === 'error' && "border-destructive bg-destructive/10",
                step.status === 'pending' && "border-border bg-background"
              )}
            >
              <div className="flex-shrink-0">
                {step.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
                {step.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                {step.status === 'pending' && (
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2",
                    isVerifying ? "border-primary border-t-transparent animate-spin" : "border-muted"
                  )} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Validation instructions for existing domains */}
      {isOwned && canProceed && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Pour confirmer que vous possédez ce domaine, vous devrez configurer 
            vos enregistrements DNS à l'étape suivante.
          </AlertDescription>
        </Alert>
      )}

      {/* Purchase info for new domains */}
      {!isOwned && canProceed && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Ce domaine est disponible ! Vous pourrez procéder à l'achat à l'étape suivante.
          </AlertDescription>
        </Alert>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Retour
        </Button>
        {!isVerifying && (
          <Button 
            onClick={canProceed ? onNext : startVerification}
            disabled={verificationSteps.some(step => step.status === 'error')}
            className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
          >
            {canProceed ? 'Continuer' : 'Relancer la vérification'}
          </Button>
        )}
      </div>
    </div>
  );
};