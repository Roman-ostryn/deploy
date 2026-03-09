import { useState, useEffect } from "react";
import { Search, Calculator, RotateCcw, MapPin, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QualityComfortPanel, { type QualityComfortState } from "@/components/QualityComfortPanel";
import { calculateCq } from "@/utils/cqCalculator";
import { calculateCv } from "@/utils/cvCalculator";

import {
  HOUSING_MAJOR_CHECKBOXES,
  HOUSING_MAJOR_SLIDERS,
  HOUSING_MINOR_CHECKBOXES,
  HOUSING_MINOR_SLIDERS,
  COMMERCE_MAJOR_CHECKBOXES,
  COMMERCE_MAJOR_SLIDERS,
  COMMERCE_MINOR_CHECKBOXES,
  COMMERCE_MINOR_SLIDERS
} from "@/components/QualityComfortPanel";

export interface SimulationData {
  propertyUse: string;
  grossPrivateArea: number;
  grossDependentArea: number;
  landArea: number;
  buildingFootprint: number;
  householdSize: number;
  primaryResidence: boolean;
  cq: number | null;
  cv: number | null;
  vc: number | null;
}

interface Props {
  onSimulate: (data: SimulationData) => void;
  onLocateOnMap: () => void;
  onClear: () => void;
  isCalculating?: boolean;
  initialLandArea?: number;
  initialRef?: string;
  initialCL?: number;
  mobileMapSlot?: React.ReactNode;
}

const emptyQualityState: QualityComfortState = {
  majorCheckboxes: {},
  minorCheckboxes: {},
  majorSliders: {},
  minorSliders: {},
};

const PropertyInputPanel = ({ onSimulate, onLocateOnMap, onClear, isCalculating, initialLandArea, initialRef, initialCL, mobileMapSlot }: Props) => {
  const [refCadastral, setRefCadastral] = useState("");
  const [propertyUse, setPropertyUse] = useState("");
  const [grossPrivateArea, setGrossPrivateArea] = useState("");
  const [grossDependentArea, setGrossDependentArea] = useState("");
  const [landArea, setLandArea] = useState("");
  const [buildingFootprint, setBuildingFootprint] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [primaryResidence, setPrimaryResidence] = useState(false);
  const [constructionAge, setConstructionAge] = useState("");
  const [qualityState, setQualityState] = useState<QualityComfortState>(emptyQualityState);
  const [showQualityPanel, setShowQualityPanel] = useState(false);
  const [buildingType, setBuildingType] = useState("");

  const isLand = propertyUse === "land";
  const canShowQuality = ["residential", "commerce", "services", "industrial"].includes(propertyUse);

  const handleSimulate = () => {
    onSimulate({
      propertyUse,
      grossPrivateArea: parseFloat(grossPrivateArea) || 0,
      grossDependentArea: parseFloat(grossDependentArea) || 0,
      landArea: parseFloat(landArea) || 0,
      buildingFootprint: parseFloat(buildingFootprint) || 0,
      householdSize: parseInt(householdSize) || 1,
      primaryResidence,
      cq: getCqValue(),
      cv: getCvValue(),
      vc: Vc ?? null,
    });
  };

  const handleClear = () => {
    setRefCadastral("");
    setPropertyUse("");
    setGrossPrivateArea("");
    setGrossDependentArea("");
    setLandArea("");
    setBuildingFootprint("");
    setHouseholdSize("");
    setPrimaryResidence(false);
    setConstructionAge("");
    setQualityState(emptyQualityState);
    setShowQualityPanel(false);
    onClear();
  };

  const handlePropertyUseChange = (value: string) => {
    setPropertyUse(value);
    setQualityState(emptyQualityState);
    setShowQualityPanel(false);
  };

  const VC_VALUES: Record<string, number> = {
    residential: 637,
    commerce: 710,
    industrial: 686,
    services: 735
  };

  const Vc = VC_VALUES[propertyUse];

  const getCqValue = () => {

    if (propertyUse === "residential") {
      return calculateCq(
        qualityState,
        HOUSING_MAJOR_CHECKBOXES,
        HOUSING_MINOR_CHECKBOXES,
        HOUSING_MAJOR_SLIDERS,
        HOUSING_MINOR_SLIDERS
      );
    }

    if (["commerce","services","industrial"].includes(propertyUse)) {
      return calculateCq(
        qualityState,
        COMMERCE_MAJOR_CHECKBOXES,
        COMMERCE_MINOR_CHECKBOXES,
        COMMERCE_MAJOR_SLIDERS,
        COMMERCE_MINOR_SLIDERS
      );
    }

    if (["parking","land"].includes(propertyUse)) {
      return 1
    }

    return null;
  };

  const getCvValue = () => {
    if (propertyUse === "land") {
      return 1.0;
    }
    return calculateCv(constructionAge);
  };

  useEffect(() => {
    if (initialLandArea) {
      setLandArea(initialLandArea.toString());
    }
  }, [initialLandArea]);

  useEffect(() => {
    setRefCadastral(initialRef ?? "");
  }, [initialRef]);

  return (
    <div className="space-y-6">
      {/* Section 1: Property Identification */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="section-title mb-4 flex items-center gap-2">
          <Search className="w-4 h-4" />
          Identificação do Imóvel
        </h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="refcadastral" className="text-sm text-muted-foreground">
              Referência Cadastral
            </Label>
            <Input
              id="refcadastral"
              placeholder="Ex: PT-1234-5678"
              value={refCadastral}
              onChange={(e) => setRefCadastral(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1 gap-2 h-10" onClick={onLocateOnMap}>
              <MapPin className="w-4 h-4" />
              Localizar no Mapa
            </Button>
            <Button variant="secondary" className="flex-1 gap-2 h-10">
              <Search className="w-4 h-4" />
              Buscar Propriedade
            </Button>
          </div>
        </div>
      </div>

      {mobileMapSlot && (
        <div className="block lg:hidden min-h-[350px]">
          {mobileMapSlot}
        </div>
      )}

      <div className="glass-panel rounded-xl p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Coeficientes
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            { code: "Vc", label: "Valor Base", value: Vc },
            { code: "Ca", label: "Afetação", value: propertyUse === "commerce" ? 1.20 : propertyUse === "services" ? 1.10 : propertyUse === "industrial" ? 0.60 : propertyUse === "parking" ? 0.40 : propertyUse === "land" ? 0.45 : propertyUse === "residential" ? 1.00 : null },
            { code: "Cl", label: "Localização", value: initialCL ?? null },
            { code: "Cq", label: "Qualidade", value: getCqValue() },
            { code: "Cv", label: "Vetustez", value: getCvValue() },
          ].map((coef) => (
            <div
              key={coef.code}
              className="rounded-lg border border-border/40 bg-muted/20 p-2 text-center transition-colors hover:bg-muted/40"
            >
              <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">{coef.label}</span>
              <span className="block text-sm font-bold text-primary">{coef.code}</span>
              <span className={`block text-xs font-mono ${coef.value != null ? "text-foreground/80" : "text-muted-foreground/50"}`}>
                {coef.value != null ? coef.value.toFixed(2) : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Property Data */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="section-title mb-4">
          📋 Dados do Imóvel
        </h3>
        <div className="space-y-3">
          {/* Row 1: Tipo de Utilização + Quality Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-muted-foreground">Tipo de Utilização</Label>
              <Select value={propertyUse} onValueChange={handlePropertyUseChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecionar utilização..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">🏠 Habitação</SelectItem>
                  <SelectItem value="commerce">🏪 Comércio</SelectItem>
                  <SelectItem value="services">🏢 Serviços</SelectItem>
                  <SelectItem value="industrial">🏭 Indústria</SelectItem>
                  <SelectItem value="parking">🅿️ Estacionamento</SelectItem>
                  <SelectItem value="land">🌍 Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Tipo de Prédio</Label>
              <Select value={buildingType} onValueChange={setBuildingType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moradia">🏡 Moradia</SelectItem>
                  <SelectItem value="apartamento">🏢 Apartamento</SelectItem>
                  <SelectItem value="edificio_comercial">🏬 Edifício Comercial</SelectItem>
                  <SelectItem value="terreno">🌍 Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-muted-foreground">🏗️ Ano de Construção</Label>
              <Select value={constructionAge} onValueChange={setConstructionAge}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecionar idade..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<2">Menos de 2 anos</SelectItem>
                  <SelectItem value="2-5">2 – 5 anos</SelectItem>
                  <SelectItem value="6-9">6 – 9 anos</SelectItem>
                  <SelectItem value="10-15">10 – 15 anos</SelectItem>
                  <SelectItem value="16-25">16 – 25 anos</SelectItem>
                  <SelectItem value="26-40">26 – 40 anos</SelectItem>
                  <SelectItem value="41-50">41 – 50 anos</SelectItem>
                  <SelectItem value="51-60">51 – 60 anos</SelectItem>
                  <SelectItem value=">60">Mais de 60 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant={showQualityPanel ? "default" : "outline"}
                className="w-full gap-2 mt-1"
                disabled={!canShowQuality}
                onClick={() => setShowQualityPanel(!showQualityPanel)}
              >
                <Settings2 className="w-4 h-4" />
                Qualidade e Conforto
              </Button>
            </div>
          </div>

          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            📐 Áreas (m²)
          </h4>

          {/* Row 2: Areas in 2-column grid */}
          {!isLand && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-muted-foreground">Área Bruta Privativa</Label>
                <Input type="number" placeholder="0.00" value={grossPrivateArea} onChange={(e) => setGrossPrivateArea(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Área Bruta Dependente</Label>
                <Input type="number" placeholder="0.00" value={grossDependentArea} onChange={(e) => setGrossDependentArea(e.target.value)} className="mt-1" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-muted-foreground">Área do Terreno</Label>
              <Input type="number" placeholder="0.00" value={landArea} onChange={(e) => setLandArea(e.target.value)} className="mt-1" />
            </div>
            {!isLand && (
              <div>
                <Label className="text-sm text-muted-foreground">Área de Implantação</Label>
                <Input type="number" placeholder="0.00" value={buildingFootprint} onChange={(e) => setBuildingFootprint(e.target.value)} className="mt-1" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quality & Comfort Modal */}
      <Dialog open={showQualityPanel} onOpenChange={setShowQualityPanel}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>⚙️ Qualidade e Conforto</DialogTitle>
          </DialogHeader>
          {canShowQuality && (
            <QualityComfortPanel
              propertyUse={propertyUse}
              state={qualityState}
              onChange={setQualityState}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Section 3: Controls */}
      <div className="flex gap-3">
        <Button onClick={handleSimulate} disabled={isCalculating} className="flex-1 gap-2 h-12 text-base font-semibold">
          <Calculator className="w-5 h-5" />
          {isCalculating ? "A calcular…" : "Simular Vt"}
        </Button>
        <Button variant="outline" onClick={handleClear} className="gap-2 h-12">
          <RotateCcw className="w-4 h-4" />
          Limpar
        </Button>
      </div>
    </div>
  );
};

export default PropertyInputPanel;
