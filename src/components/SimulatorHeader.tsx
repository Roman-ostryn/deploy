import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import headerLogo from "@/assets/header_logo.png";

const SimulatorHeader = () => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <img src={headerLogo} alt="GeoIMI" className="w-9 h-9 object-contain" />
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">
              Simulador de Valor Patrimonial Tributário
            </h1>
            <p className="text-xs text-muted-foreground">
              Cálculo do Valor Tributável (Vt) — Código do IMI
            </p>
          </div>
        </div>
        <Link to="/login">
          <Button variant="outline" size="sm" className="gap-2">
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default SimulatorHeader;
