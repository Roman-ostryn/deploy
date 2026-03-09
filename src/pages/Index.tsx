import { useState, useRef } from "react";
import SimulatorHeader from "@/components/SimulatorHeader";
import PropertyInputPanel, { SimulationData } from "@/components/PropertyInputPanel";
import mainLogo from "@/assets/main_logo.png";
import MapPanel from "@/components/MapPanel";
import SimulationResults from "@/components/SimulationResults";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [vtValue, setVtValue] = useState(0);
  const [selectedLandArea, setSelectedLandArea] = useState(0);
  const [selectedRef, setSelectedRef] = useState("");
  const [selectedCL, setSelectedCL] = useState(null);
  const [locateMode, setLocateMode] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleClear = () => {
    setShowResults(false);
    setIsCalculating(false);
    setVtValue(0);
  };

  const handleParcelSelect = (area: number, ref: string, cl: number) => {
    console.log("Parcel area:", area);
    console.log("Cadastral ref:", ref);

    setSelectedLandArea(area);
    setSelectedRef(ref);
    setSelectedCL(cl);
  };

  const handleSimulate = (data: SimulationData) => {
    setShowResults(false);
    setIsCalculating(true);

    setTimeout(() => {

      const Vc = data.vc;

      const A =
        data.grossPrivateArea +
        0.3 * data.grossDependentArea +
        0.025 * data.landArea;

      const Ca =
        data.propertyUse === "commerce"
          ? 1.2
          : data.propertyUse === "services"
          ? 1.1
          : data.propertyUse === "industrial"
          ? 0.6
          : data.propertyUse === "parking"
          ? 0.4
          : data.propertyUse === "land"
          ? 0.45
          : 1.0;

      const Cl = selectedCL ?? 1.0;

      const Cq = data.cq ?? 1.0;

      const Cv = data.cv ?? 1.0;

      const vt = Vc * A * Ca * Cl * Cq * Cv;

      setVtValue(Math.round(vt * 100) / 100);

      setCoefficients([
        {
          label: "Valor base (€/m²)",
          code: "Vc",
          value: `${Vc.toFixed(2)} €`,
          description:
            "Valor base dos prédios edificados conforme Portaria vigente.",
        },
        {
          label: "Área equivalente",
          code: "A",
          value: `${A.toFixed(2)} m²`,
          description:
            "A = Aa + 0.30×Ab + 0.025×Ac",
        },
        {
          label: "Coef. de afetação",
          code: "Ca",
          value: Ca.toFixed(2),
          description:
            "Depende do tipo de utilização do imóvel.",
        },
        {
          label: "Coef. de localização",
          code: "Cl",
          value: Cl.toFixed(2),
          description:
            "Obtido automaticamente pela zona cadastral.",
        },
        {
          label: "Coef. de qualidade",
          code: "Cq",
          value: Cq.toFixed(2),
          description:
            "Checklist de qualidade e conforto.",
        },
        {
          label: "Coef. de vetustez",
          code: "Cv",
          value: Cv.toFixed(2),
          description:
            "Redução pelo envelhecimento do edifício.",
        },
      ]);

      setIsCalculating(false);
      setShowResults(true);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

    }, 1800);
  };

  const handleLocateOnMap = () => {
    setLocateMode(true);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLocateMode(false);
    console.log("Selected location:", lat, lng);
  };

  const [coefficients, setCoefficients] = useState([]);

  return (
    <div className="min-h-screen flex flex-col">
      <SimulatorHeader />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Panel */}
          <div className="space-y-6">
            <PropertyInputPanel onSimulate={handleSimulate} onLocateOnMap={handleLocateOnMap} onClear={handleClear} isCalculating={isCalculating} initialLandArea={selectedLandArea} initialRef={selectedRef} initialCL={selectedCL} mobileMapSlot={<MapPanel onMapClick={handleMapClick} locateMode={locateMode} />} />
            <div ref={resultsRef}>
              <SimulationResults
                visible={showResults}
                isCalculating={isCalculating}
                vtValue={vtValue}
                coefficients={coefficients}
              />
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="hidden lg:block lg:sticky lg:top-24 min-h-[500px]">
            <MapPanel
              onMapClick={handleMapClick}
              onParcelSelect={handleParcelSelect}
              locateMode={locateMode}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-3">
          <img src={mainLogo} alt="GeoIMI - Plataforma Cadastral" className="w-20 h-20 object-contain opacity-85 drop-shadow-lg" />
          <p className="text-xs text-muted-foreground">Simulador de Valor Patrimonial Tributário — Código do IMI</p>
          <p className="text-[10px] text-muted-foreground/60">© 2026 GeoIMI — Plataforma Cadastral</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
