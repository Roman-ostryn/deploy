import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export interface QualityComfortState {
  majorCheckboxes: Record<string, boolean>;
  minorCheckboxes: Record<string, boolean>;
  majorSliders: Record<string, number>;
  minorSliders: Record<string, number>;
}

interface CheckboxItem {
  id: string;
  label: string;
  value: number;
}

interface SliderItem {
  id: string;
  label: string;
  max: number;
}

interface Props {
  propertyUse: string;
  state: QualityComfortState;
  onChange: (state: QualityComfortState) => void;
}

export const HOUSING_MAJOR_CHECKBOXES: CheckboxItem[] = [
  { id: "moradia_uni", label: "Moradia unifamiliar", value: 0.05 },
  { id: "condominio", label: "Condomínio fechado", value: 0.20 },
  { id: "garagem_ind", label: "Garagem individual", value: 0.04 },
  { id: "garagem_col", label: "Garagem coletiva", value: 0.03 },
  { id: "piscina_ind", label: "Piscina individual", value: 0.06 },
  { id: "piscina_col", label: "Piscina coletiva", value: 0.03 },
  { id: "campos_tenis", label: "Campos de ténis", value: 0.03 },
  { id: "equip_lazer", label: "Equipamentos de lazer", value: 0.04 },
  { id: "climatizacao", label: "Sistema central de climatização", value: 0.03 },
  { id: "elevador_4", label: "Elevador em edifício < 4 pisos", value: 0.02 },
];

export const HOUSING_MAJOR_SLIDERS: SliderItem[] = [
  { id: "loc_excecional", label: "Localização excecional", max: 0.10 },
  { id: "loc_operacionalidade", label: "Localização e operacionalidade", max: 0.05 },
];

export const HOUSING_MINOR_CHECKBOXES: CheckboxItem[] = [
  { id: "sem_cozinha", label: "Sem cozinha", value: 0.10 },
  { id: "sem_sanitarias", label: "Sem instalações sanitárias", value: 0.10 },
  { id: "sem_agua", label: "Sem rede de água", value: 0.08 },
  { id: "sem_eletricidade", label: "Sem eletricidade", value: 0.10 },
  { id: "sem_gas", label: "Sem gás", value: 0.02 },
  { id: "sem_esgotos", label: "Sem esgotos", value: 0.05 },
  { id: "rua_nao_pav", label: "Rua não pavimentada", value: 0.03 },
  { id: "sem_elevador_3", label: "Sem elevador em edifício >3 pisos", value: 0.02 },
  { id: "area_inferior", label: "Área inferior à regulamentar", value: 0.05 },
];

export const HOUSING_MINOR_SLIDERS: SliderItem[] = [
  { id: "conservacao_def", label: "Estado de conservação deficiente", max: 0.05 },
  { id: "loc_neg", label: "Localização e operacionalidade negativas", max: 0.05 },
];

export const COMMERCE_MAJOR_CHECKBOXES: CheckboxItem[] = [
  { id: "centro_comercial", label: "Centro comercial", value: 0.25 },
  { id: "ed_escritorios", label: "Edifício de escritórios", value: 0.10 },
  { id: "climatizacao", label: "Sistema central de climatização", value: 0.10 },
  { id: "elevador_escada", label: "Elevador / escada rolante", value: 0.03 },
];

export const COMMERCE_MAJOR_SLIDERS: SliderItem[] = [
  { id: "loc_operacionalidade", label: "Localização e operacionalidade", max: 0.20 },
];

export const COMMERCE_MINOR_CHECKBOXES: CheckboxItem[] = [
  { id: "sem_sanitarias", label: "Sem instalações sanitárias", value: 0.10 },
  { id: "sem_agua", label: "Sem rede de água", value: 0.08 },
  { id: "sem_eletricidade", label: "Sem eletricidade", value: 0.10 },
  { id: "sem_esgotos", label: "Sem esgotos", value: 0.05 },
  { id: "rua_nao_pav", label: "Rua não pavimentada", value: 0.03 },
  { id: "sem_elevador_3", label: "Sem elevador em edifício >3 pisos", value: 0.02 },
];

export const COMMERCE_MINOR_SLIDERS: SliderItem[] = [
  { id: "conservacao_def", label: "Estado de conservação deficiente", max: 0.05 },
  { id: "loc_neg", label: "Localização negativa", max: 0.10 },
];

function getConfig(propertyUse: string) {
  if (propertyUse === "residential") {
    return {
      majorCheckboxes: HOUSING_MAJOR_CHECKBOXES,
      majorSliders: HOUSING_MAJOR_SLIDERS,
      minorCheckboxes: HOUSING_MINOR_CHECKBOXES,
      minorSliders: HOUSING_MINOR_SLIDERS,
    };
  }
  if (["commerce", "services", "industrial"].includes(propertyUse)) {
    return {
      majorCheckboxes: COMMERCE_MAJOR_CHECKBOXES,
      majorSliders: COMMERCE_MAJOR_SLIDERS,
      minorCheckboxes: COMMERCE_MINOR_CHECKBOXES,
      minorSliders: COMMERCE_MINOR_SLIDERS,
    };
  }
  return null;
}

const QualityComfortPanel = ({ propertyUse, state, onChange }: Props) => {
  const config = getConfig(propertyUse);
  if (!config) return null;

  const toggleCheckbox = (group: "majorCheckboxes" | "minorCheckboxes", id: string) => {
    onChange({
      ...state,
      [group]: { ...state[group], [id]: !state[group][id] },
    });
  };

  const setSlider = (group: "majorSliders" | "minorSliders", id: string, value: number) => {
    onChange({
      ...state,
      [group]: { ...state[group], [id]: value },
    });
  };

  return (
    <div className="space-y-4">

      {/* Majorativos */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wide mb-2">
          ▲ Majorativos
        </h4>
        <div className="space-y-2">
          {config.majorCheckboxes.map((item) => (
            <label key={item.id} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={!!state.majorCheckboxes[item.id]}
                onCheckedChange={() => toggleCheckbox("majorCheckboxes", item.id)}
                className="h-5 w-5"
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground leading-tight flex-1">
                {item.label}
              </span>
              <span className="text-xs font-mono text-emerald-500">
                +{item.value.toFixed(2)}
              </span>
            </label>
          ))}
        </div>

        {config.majorSliders.length > 0 && (
          <div className="mt-2 space-y-2">
            {config.majorSliders.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between mb-1">
          <Label className="text-sm text-muted-foreground">{item.label}</Label>
                   <span className="text-xs font-mono text-emerald-500">
                     +{(state.majorSliders[item.id] || 0).toFixed(2)}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={item.max * 100}
                  step={1}
                  value={[(state.majorSliders[item.id] || 0) * 100]}
                  onValueChange={([v]) => setSlider("majorSliders", item.id, v / 100)}
                  className="h-4"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                  <span>0.00</span>
                  <span>{item.max.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Minorativos */}
      <div>
        <h4 className="text-xs font-semibold text-destructive uppercase tracking-wide mb-2">
          ▼ Minorativos
        </h4>
        <div className="space-y-2">
          {config.minorCheckboxes.map((item) => (
            <label key={item.id} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={!!state.minorCheckboxes[item.id]}
                onCheckedChange={() => toggleCheckbox("minorCheckboxes", item.id)}
                className="h-5 w-5"
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground leading-tight flex-1">
                {item.label}
              </span>
              <span className="text-xs font-mono text-destructive">
                -{item.value.toFixed(2)}
              </span>
            </label>
          ))}
        </div>

        {config.minorSliders.length > 0 && (
          <div className="mt-2 space-y-2">
            {config.minorSliders.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between mb-1">
          <Label className="text-sm text-muted-foreground">{item.label}</Label>
                   <span className="text-xs font-mono text-destructive">
                     -{(state.minorSliders[item.id] || 0).toFixed(2)}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={item.max * 100}
                  step={1}
                  value={[(state.minorSliders[item.id] || 0) * 100]}
                  onValueChange={([v]) => setSlider("minorSliders", item.id, v / 100)}
                  className="h-4"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                  <span>0.00</span>
                  <span>{item.max.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityComfortPanel;
