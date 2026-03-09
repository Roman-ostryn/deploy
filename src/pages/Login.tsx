import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import mainLogo from "@/assets/main_logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo ao GeoIMI</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plataforma Cadastral — Simulador de Valor Patrimonial
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Iniciar Sessão</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Introduza as suas credenciais para aceder à plataforma
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-foreground">
                Palavra-passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/50 border-border focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-xs text-primary hover:underline">
                Esqueceu a palavra-passe?
              </button>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg">
              <LogIn className="w-4 h-4" />
              Entrar
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">ou</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <button type="button" className="text-primary hover:underline font-medium">
              Solicitar acesso
            </button>
          </p>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar ao simulador público
          </Link>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/60">
          © 2026 GeoIMI — Plataforma Cadastral
        </p>
      </div>
    </div>
  );
};

export default Login;
