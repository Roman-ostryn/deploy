import { ChevronDown, FileText, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useRef } from "react";

interface CoefficientRow {
  label: string;
  code: string;
  value: string;
  description: string;
}

interface Props {
  visible: boolean;
  isCalculating: boolean;
  vtValue: number;
  coefficients: CoefficientRow[];
}

const SimulationResults = ({ visible, isCalculating, vtValue, coefficients }: Props) => {
  const [memoryOpen, setMemoryOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleExport = (mode: 'pdf' | 'print') => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Simulação VPT - GeoIMI</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 32px; color: #1a1a1a; }
        .result-box { text-align: center; border: 2px solid #0d6efd; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
        .result-box p:first-child { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; opacity: 0.7; }
        .result-box p:last-child { font-size: 32px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { padding: 10px 16px; text-align: left; border-bottom: 1px solid #e0e0e0; }
        th { background: #f5f5f5; font-weight: 600; }
        tr:nth-child(even) { background: #fafafa; }
        .glass-panel { border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; }
        .section-title { font-weight: 600; font-size: 14px; }
        h3 { margin: 0; padding: 12px 16px; }
      </style></head><body>${content}</body></html>
    `);
    win.document.close();
    if (mode === 'print') {
      win.print();
    }
  };

  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">A calcular o Valor Patrimonial Tributável…</p>
      </div>
    );
  }

  if (!visible) return null;

  const formattedVt = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(vtValue);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Printable area */}
      <div ref={printRef}>
      {/* Result Box */}
      <div className="result-box rounded-xl p-6 text-center">
        <p className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">
          Valor Patrimonial Tributável (Vt)
        </p>
        <p className="text-4xl font-bold tracking-tight">{formattedVt}</p>
      </div>

      {/* Coefficients Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h3 className="section-title">📊 Decomposição do Cálculo</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="table-header-row">
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Coeficiente</th>
              <th className="text-left px-4 py-2.5 font-semibold text-foreground">Código</th>
              <th className="text-right px-4 py-2.5 font-semibold text-foreground">Valor</th>
            </tr>
          </thead>
          <tbody>
            {coefficients.map((row, i) => (
              <tr key={row.code} className={i % 2 === 1 ? "table-stripe" : ""}>
                <td className="px-4 py-2.5 text-foreground">{row.label}</td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground text-xs">{row.code}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-foreground">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div> {/* end printable area */}
      {/* Calculation Memory */}
      <Collapsible open={memoryOpen} onOpenChange={setMemoryOpen}>
        <CollapsibleTrigger asChild>
          <button className="glass-panel rounded-xl w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors">
            <span className="section-title">🧾 Memória de Cálculo</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${memoryOpen ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="glass-panel rounded-xl mt-2 p-4 space-y-3 text-sm text-muted-foreground">
            {coefficients.map((row) => (
              <div key={row.code}>
                <p className="font-medium text-foreground">{row.label} ({row.code})</p>
                <p>{row.description}</p>
              </div>
            ))}
            <div className="pt-2 border-t">
              <p className="font-medium text-foreground">Fórmula aplicada:</p>
              <p className="font-mono text-xs mt-1">Vt = Vc × A × Ca × Cl × Cq × Cv</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 gap-2" onClick={() => handleExport('pdf')}>
          <FileText className="w-4 h-4" />
          Exportar PDF
        </Button>
        <Button variant="outline" className="flex-1 gap-2" onClick={() => handleExport('print')}>
          <Printer className="w-4 h-4" />
          Imprimir
        </Button>
      </div>
    </div>
  );
};

export default SimulationResults;
