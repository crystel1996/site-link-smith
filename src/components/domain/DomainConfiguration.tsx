import { useState } from "react";
import { Settings, Copy, ExternalLink, Globe, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DomainConfigurationProps {
  domain: string;
  isOwned: boolean;
  onNext: () => void;
  onBack: () => void;
}

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: string;
}

export const DomainConfiguration = ({ domain, isOwned, onNext, onBack }: DomainConfigurationProps) => {
  const [configMethod, setConfigMethod] = useState<'dns' | 'nameservers'>('dns');
  const [isTestingDNS, setIsTestingDNS] = useState(false);
  const [dnsTestResult, setDnsTestResult] = useState<'pending' | 'success' | 'error'>('pending');
  const { toast } = useToast();

  const dnsRecords: DNSRecord[] = [
    { type: 'A', name: '@', value: '185.158.133.1', ttl: '3600' },
    { type: 'A', name: 'www', value: '185.158.133.1', ttl: '3600' },
    { type: 'CNAME', name: 'api', value: 'api.sitebuilder.app', ttl: '3600' }
  ];

  const nameservers = [
    'ns1.sitebuilder.app',
    'ns2.sitebuilder.app'
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "L'enregistrement DNS a été copié dans le presse-papier"
    });
  };

  const testDNS = async () => {
    setIsTestingDNS(true);
    setDnsTestResult('pending');
    
    // Simuler le test DNS
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% de succès
      setDnsTestResult(success ? 'success' : 'error');
      setIsTestingDNS(false);
      
      if (success) {
        toast({
          title: "Configuration DNS validée",
          description: "Votre domaine pointe correctement vers nos serveurs"
        });
      } else {
        toast({
          title: "Configuration DNS en attente",
          description: "Il peut falloir jusqu'à 48h pour que les changements DNS se propagent",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Configuration technique</h2>
        <p className="text-muted-foreground">
          Connectez votre domaine <span className="font-medium text-foreground">{domain}</span> à votre site
        </p>
      </div>

      {/* Configuration method choice */}
      {isOwned && (
        <Card className="border-border bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Méthode de configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={configMethod} onValueChange={(value) => setConfigMethod(value as 'dns' | 'nameservers')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dns">Enregistrements DNS</TabsTrigger>
                <TabsTrigger value="nameservers">Serveurs de noms</TabsTrigger>
              </TabsList>
              <TabsContent value="dns" className="mt-4">
                <Alert>
                  <Globe className="h-4 w-4" />
                  <AlertDescription>
                    Recommandé si vous voulez garder le contrôle de vos DNS ou si vous utilisez 
                    d'autres services (email, sous-domaines).
                  </AlertDescription>
                </Alert>
              </TabsContent>
              <TabsContent value="nameservers" className="mt-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Plus simple à configurer. Nous gérerons automatiquement tous vos enregistrements DNS.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* DNS Configuration */}
      {(configMethod === 'dns' || !isOwned) && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {isOwned ? 'Enregistrements DNS à configurer' : 'Configuration DNS automatique'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isOwned ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Ajoutez ces enregistrements DNS dans l'interface de votre registrar :
                </p>
                <div className="space-y-3">
                  {dnsRecords.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{record.type}</Badge>
                          <span className="font-mono text-sm">{record.name}</span>
                        </div>
                        <div className="font-mono text-sm text-muted-foreground">
                          {record.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          TTL: {record.ttl}s
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${record.type} ${record.name} ${record.value}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    La propagation DNS peut prendre jusqu'à 48 heures. Nous vérifierons 
                    automatiquement la configuration et vous notifierons quand elle sera active.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-success mx-auto" />
                <div>
                  <h3 className="font-medium">Configuration automatique</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre domaine sera automatiquement configuré avec nos serveurs DNS optimisés.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="font-medium">SSL/TLS automatique</div>
                    <div className="text-success">Let's Encrypt inclus</div>
                  </div>
                  <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="font-medium">CDN global</div>
                    <div className="text-success">Performance optimale</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Nameservers Configuration */}
      {configMethod === 'nameservers' && isOwned && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Serveurs de noms à configurer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Remplacez les serveurs de noms de votre domaine par ceux-ci :
            </p>
            <div className="space-y-2">
              {nameservers.map((nameserver, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                >
                  <span className="font-mono">{nameserver}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(nameserver)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Cette méthode nous donne le contrôle complet de votre DNS. 
                Nous gérerons automatiquement SSL, sous-domaines et optimisations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* DNS Test */}
      {isOwned && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Test de configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={testDNS}
                disabled={isTestingDNS}
                variant="outline"
                className="flex-shrink-0"
              >
                {isTestingDNS ? (
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Tester la configuration"
                )}
              </Button>
              <div className="flex items-center gap-2">
                {dnsTestResult === 'success' && (
                  <>
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-success font-medium">Configuration validée</span>
                  </>
                )}
                {dnsTestResult === 'error' && (
                  <>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="text-destructive font-medium">Configuration en attente</span>
                  </>
                )}
                {dnsTestResult === 'pending' && !isTestingDNS && (
                  <span className="text-muted-foreground">Cliquez pour tester votre configuration</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help links */}
      <Card className="border-border bg-gradient-to-br from-muted/20 to-muted/10">
        <CardHeader>
          <CardTitle className="text-lg">Besoin d'aide ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Button variant="link" className="h-auto p-0 justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Guide de configuration DNS par registrar
            </Button>
            <Button variant="link" className="h-auto p-0 justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Vérifier la propagation DNS
            </Button>
            <Button variant="link" className="h-auto p-0 justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Support technique
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Retour
        </Button>
        <Button 
          onClick={onNext}
          className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};