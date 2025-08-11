import { useState } from "react";
import { CreditCard, ShoppingCart, Check, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface DomainPurchaseProps {
  domain: string;
  onNext: () => void;
  onBack: () => void;
}

interface PricingOption {
  years: number;
  pricePerYear: number;
  totalPrice: number;
  savings?: number;
}

export const DomainPurchase = ({ domain, onNext, onBack }: DomainPurchaseProps) => {
  const [selectedPlan, setSelectedPlan] = useState("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: ""
  });
  const { toast } = useToast();

  const pricingOptions: PricingOption[] = [
    { years: 1, pricePerYear: 12.99, totalPrice: 12.99 },
    { years: 2, pricePerYear: 11.99, totalPrice: 23.98, savings: 2.00 },
    { years: 5, pricePerYear: 10.99, totalPrice: 54.95, savings: 10.20 }
  ];

  const selectedOption = pricingOptions.find(option => option.years.toString() === selectedPlan);

  const handlePurchase = async () => {
    if (!billingInfo.email || !billingInfo.firstName || !billingInfo.lastName) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simuler le processus d'achat
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Achat réussi !",
        description: `Le domaine ${domain} a été acheté avec succès`
      });
      onNext();
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Achat du domaine</h2>
        <p className="text-muted-foreground">
          Finalisez l'achat de votre domaine : <span className="font-medium text-foreground">{domain}</span>
        </p>
      </div>

      {/* Domain summary */}
      <Card className="border-border bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Récapitulatif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{domain}</span>
            <Badge className="bg-success text-success-foreground">Disponible</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Extension premium avec protection de la vie privée incluse
          </div>
        </CardContent>
      </Card>

      {/* Pricing options */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Choisissez la durée d'enregistrement</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
            <div className="space-y-3">
              {pricingOptions.map((option) => (
                <div
                  key={option.years}
                  className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setSelectedPlan(option.years.toString())}
                >
                  <RadioGroupItem value={option.years.toString()} id={`plan-${option.years}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`plan-${option.years}`} className="font-medium cursor-pointer">
                        {option.years} an{option.years > 1 ? 's' : ''}
                      </Label>
                      <div className="text-right">
                        <div className="font-semibold">{option.totalPrice.toFixed(2)}€</div>
                        <div className="text-sm text-muted-foreground">
                          {option.pricePerYear.toFixed(2)}€/an
                        </div>
                      </div>
                    </div>
                    {option.savings && (
                      <div className="text-sm text-success mt-1">
                        Économisez {option.savings.toFixed(2)}€
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Billing information */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Informations de facturation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={billingInfo.firstName}
                onChange={(e) => setBillingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={billingInfo.lastName}
                onChange={(e) => setBillingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                className="bg-background"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={billingInfo.email}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, email: e.target.value }))}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Entreprise (optionnel)</Label>
            <Input
              id="company"
              value={billingInfo.company}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, company: e.target.value }))}
              className="bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Order summary */}
      <Card className="border-primary bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Récapitulatif de commande
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>{domain} ({selectedOption?.years} an{selectedOption?.years && selectedOption.years > 1 ? 's' : ''})</span>
            <span className="font-semibold">{selectedOption?.totalPrice.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Protection de la vie privée</span>
            <span>Inclus</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Configuration DNS automatique</span>
            <span>Inclus</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">{selectedOption?.totalPrice.toFixed(2)}€</span>
          </div>
        </CardContent>
      </Card>

      {/* Important info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Votre domaine sera automatiquement configuré avec nos serveurs DNS. 
          Vous pourrez modifier ces paramètres à tout moment depuis votre tableau de bord.
        </AlertDescription>
      </Alert>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={isProcessing}>
          Retour
        </Button>
        <Button 
          onClick={handlePurchase}
          disabled={isProcessing}
          className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Traitement...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Acheter le domaine
            </>
          )}
        </Button>
      </div>
    </div>
  );
};