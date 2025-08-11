import { useState } from "react";
import { Search, Globe, ShoppingCart, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DomainSearchProps {
  onNext: (domain: string, isOwned: boolean) => void;
}

interface DomainResult {
  domain: string;
  available: boolean;
  price?: string;
  premium?: boolean;
}

export const DomainSearch = ({ onNext }: DomainSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOwned, setIsOwned] = useState<boolean | null>(null);
  const [searchResults, setSearchResults] = useState<DomainResult[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    // Simulation d'une recherche API
    setTimeout(() => {
      const mockResults: DomainResult[] = [
        { domain: `${searchTerm}.com`, available: true, price: "12.99€" },
        { domain: `${searchTerm}.fr`, available: true, price: "15.99€" },
        { domain: `${searchTerm}.net`, available: false },
        { domain: `${searchTerm}.org`, available: true, price: "14.99€" },
        { domain: `${searchTerm}.io`, available: true, price: "59.99€", premium: true },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleDomainSelect = (domain: string) => {
    setSelectedDomain(domain);
  };

  const handleContinue = () => {
    if (selectedDomain) {
      onNext(selectedDomain, isOwned === true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Configurez votre nom de domaine</h2>
        <p className="text-muted-foreground">
          Utilisez un domaine existant ou recherchez-en un nouveau à acheter
        </p>
      </div>

      {/* Choice between existing or new domain */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className={cn(
            "cursor-pointer transition-all duration-300 border-2 hover:shadow-[var(--shadow-card)]",
            isOwned === true ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5" : "border-border"
          )}
          onClick={() => setIsOwned(true)}
        >
          <CardHeader className="text-center pb-2">
            <Globe className="h-8 w-8 mx-auto text-primary" />
            <CardTitle className="text-lg">Domaine existant</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              J'ai déjà acheté mon domaine
            </p>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "cursor-pointer transition-all duration-300 border-2 hover:shadow-[var(--shadow-card)]",
            isOwned === false ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5" : "border-border"
          )}
          onClick={() => setIsOwned(false)}
        >
          <CardHeader className="text-center pb-2">
            <ShoppingCart className="h-8 w-8 mx-auto text-primary" />
            <CardTitle className="text-lg">Nouveau domaine</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Je veux acheter un domaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Domain search */}
      {isOwned !== null && (
        <Card className="border-border bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {isOwned ? "Saisissez votre domaine" : "Rechercher un domaine"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={isOwned ? "monsite.com" : "nom-de-votre-site"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-background border-input"
              />
              <Button 
                onClick={handleSearch}
                disabled={!searchTerm.trim() || isSearching}
                className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
              >
                {isSearching ? "..." : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">
                  {isOwned ? "Votre domaine :" : "Domaines disponibles :"}
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {isOwned ? (
                    <div
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all",
                        selectedDomain === searchTerm ? "border-primary bg-primary/10" : "border-border bg-background"
                      )}
                      onClick={() => handleDomainSelect(searchTerm)}
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="font-medium">{searchTerm}</span>
                      </div>
                      {selectedDomain === searchTerm && (
                        <Check className="h-4 w-4 text-success" />
                      )}
                    </div>
                  ) : (
                    searchResults.map((result) => (
                      <div
                        key={result.domain}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                          result.available 
                            ? selectedDomain === result.domain 
                              ? "border-primary bg-primary/10 cursor-pointer" 
                              : "border-border bg-background cursor-pointer hover:border-primary/50"
                            : "border-muted bg-muted/20 cursor-not-allowed opacity-60"
                        )}
                        onClick={() => result.available && handleDomainSelect(result.domain)}
                      >
                        <div className="flex items-center gap-3">
                          {result.available ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <X className="h-4 w-4 text-destructive" />
                          )}
                          <span className="font-medium">{result.domain}</span>
                          {result.premium && (
                            <Badge variant="outline" className="border-primary text-primary">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {result.available ? (
                            <>
                              <span className="font-semibold text-success">{result.price}</span>
                              {selectedDomain === result.domain && (
                                <Check className="h-4 w-4 text-success" />
                              )}
                            </>
                          ) : (
                            <span className="text-destructive font-medium">Indisponible</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {selectedDomain && (
              <Button 
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
              >
                Continuer avec {selectedDomain}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};