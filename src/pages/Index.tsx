import { useState } from "react";
import { DomainStepper } from "@/components/domain/DomainStepper";
import { DomainSearch } from "@/components/domain/DomainSearch";
import { DomainVerification } from "@/components/domain/DomainVerification";
import { DomainPurchase } from "@/components/domain/DomainPurchase";
import { DomainConfiguration } from "@/components/domain/DomainConfiguration";
import { DomainActivation } from "@/components/domain/DomainActivation";
import { DomainManagement } from "@/components/domain/DomainManagement";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [isDomainOwned, setIsDomainOwned] = useState(false);

  const steps = [
    { id: 1, title: "Domaine", description: "Choix du nom" },
    { id: 2, title: "Vérification", description: "Validation" },
    { id: 3, title: "Achat", description: "Commande" },
    { id: 4, title: "Configuration", description: "DNS & SSL" },
    { id: 5, title: "Activation", description: "Mise en ligne" },
    { id: 6, title: "Gestion", description: "Administration" }
  ];

  const handleDomainSelect = (domain: string, isOwned: boolean) => {
    setSelectedDomain(domain);
    setIsDomainOwned(isOwned);
    setCurrentStep(2);
  };

  const handleVerificationComplete = () => {
    if (isDomainOwned) {
      setCurrentStep(4); // Skip purchase for owned domains
    } else {
      setCurrentStep(3); // Go to purchase for new domains
    }
  };

  const handlePurchaseComplete = () => {
    setCurrentStep(4);
  };

  const handleConfigurationComplete = () => {
    setCurrentStep(5);
  };

  const handleActivationComplete = () => {
    setCurrentStep(6);
  };

  const handleBackToStart = () => {
    setCurrentStep(1);
    setSelectedDomain("");
    setIsDomainOwned(false);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DomainSearch onNext={handleDomainSelect} />;
      case 2:
        return (
          <DomainVerification
            domain={selectedDomain}
            isOwned={isDomainOwned}
            onNext={handleVerificationComplete}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <DomainPurchase
            domain={selectedDomain}
            onNext={handlePurchaseComplete}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return (
          <DomainConfiguration
            domain={selectedDomain}
            isOwned={isDomainOwned}
            onNext={handleConfigurationComplete}
            onBack={() => setCurrentStep(isDomainOwned ? 2 : 3)}
          />
        );
      case 5:
        return (
          <DomainActivation
            domain={selectedDomain}
            onNext={handleActivationComplete}
            onBack={() => setCurrentStep(4)}
          />
        );
      case 6:
        return (
          <DomainManagement
            domain={selectedDomain}
            onBack={handleBackToStart}
          />
        );
      default:
        return <DomainSearch onNext={handleDomainSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SB</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Site Builder</h1>
                <p className="text-sm text-muted-foreground">Configuration de domaine</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Étape {currentStep} sur {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stepper */}
          <DomainStepper currentStep={currentStep} steps={steps} />
          
          {/* Step content */}
          <div className="mt-8">
            {renderCurrentStep()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Site Builder - Gestionnaire de domaines professionnel
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
