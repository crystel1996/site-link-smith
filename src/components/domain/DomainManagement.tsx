import { useState } from "react";
import { 
  Globe, Settings, Calendar, Shield, BarChart3, 
  Plus, ExternalLink, Edit, Trash2, AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface DomainManagementProps {
  domain: string;
  onBack: () => void;
}

interface Subdomain {
  id: string;
  name: string;
  target: string;
  status: 'active' | 'pending' | 'error';
  ssl: boolean;
}

export const DomainManagement = ({ domain, onBack }: DomainManagementProps) => {
  const [subdomains, setSubdomains] = useState<Subdomain[]>([
    { id: '1', name: 'www', target: 'main-site.com', status: 'active', ssl: true },
    { id: '2', name: 'api', target: 'api-server.com', status: 'active', ssl: true },
    { id: '3', name: 'blog', target: 'blog.example.com', status: 'pending', ssl: false }
  ]);
  
  const [expirationDate] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
  const { toast } = useToast();

  const handleRenewDomain = () => {
    toast({
      title: "Renouvellement programmé",
      description: "Le renouvellement automatique a été activé pour ce domaine"
    });
  };

  const handleAddSubdomain = () => {
    toast({
      title: "Sous-domaine",
      description: "Fonctionnalité d'ajout de sous-domaine en cours de développement"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Actif</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-primary text-primary">En attente</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Gestion du domaine</h2>
        <p className="text-muted-foreground">
          Gérez et surveillez votre domaine <span className="font-medium text-foreground">{domain}</span>
        </p>
      </div>

      {/* Domain overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-gradient-to-br from-success/10 to-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-success" />
              Statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Actif</div>
            <p className="text-sm text-muted-foreground">Domaine opérationnel</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              SSL/TLS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Sécurisé</div>
            <p className="text-sm text-muted-foreground">Let's Encrypt</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-sm text-muted-foreground">Uptime (30j)</p>
          </CardContent>
        </Card>
      </div>

      {/* Expiration warning */}
      {daysUntilExpiration < 90 && (
        <Alert className="border-primary bg-primary/10">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <AlertDescription>
            Votre domaine expire dans {daysUntilExpiration} jours. 
            <Button variant="link" className="h-auto p-0 ml-1" onClick={handleRenewDomain}>
              Activer le renouvellement automatique
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Domain details */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Détails du domaine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Domaine :</span>
                <span className="font-medium">{domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Registrar :</span>
                <span className="font-medium">SiteBuilder Registry</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">DNS :</span>
                <Badge variant="outline" className="border-success text-success">
                  Configuré
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date d'expiration :</span>
                <span className="font-medium">{expirationDate.toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Renouvellement auto :</span>
                <Badge className="bg-success text-success-foreground">Activé</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Protection WHOIS :</span>
                <Badge className="bg-success text-success-foreground">Activée</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subdomains management */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Sous-domaines
            </div>
            <Button onClick={handleAddSubdomain} size="sm" className="bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sous-domaine</TableHead>
                <TableHead>Cible</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>SSL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subdomains.map((subdomain) => (
                <TableRow key={subdomain.id}>
                  <TableCell className="font-medium">
                    {subdomain.name}.{domain}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {subdomain.target}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(subdomain.status)}
                  </TableCell>
                  <TableCell>
                    {subdomain.ssl ? (
                      <Badge variant="outline" className="border-success text-success">
                        Actif
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted text-muted-foreground">
                        Inactif
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card className="border-border bg-gradient-to-br from-muted/20 to-muted/10">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Renouveler le domaine
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Modifier les DNS
            </Button>
            <Button variant="outline" className="justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir les analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={onBack} className="w-full md:w-auto">
          Revenir au début
        </Button>
      </div>
    </div>
  );
};