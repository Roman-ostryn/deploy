import { QualityComfortState } from "@/components/QualityComfortPanel";

interface CheckboxItem {
  id: string;
  value: number;
}

interface SliderItem {
  id: string;
}

export function calculateCq(
  state: QualityComfortState,
  majorCheckboxes: CheckboxItem[],
  minorCheckboxes: CheckboxItem[],
  majorSliders: SliderItem[],
  minorSliders: SliderItem[]
): number {

  let major = 0;
  let minor = 0;

  // major checkboxes
  majorCheckboxes.forEach((item) => {
    if (state.majorCheckboxes[item.id]) {
      major += item.value;
    }
  });

  // minor checkboxes
  minorCheckboxes.forEach((item) => {
    if (state.minorCheckboxes[item.id]) {
      minor += item.value;
    }
  });

  // major sliders
  majorSliders.forEach((item) => {
    major += state.majorSliders[item.id] || 0;
  });

  // minor sliders
  minorSliders.forEach((item) => {
    minor += state.minorSliders[item.id] || 0;
  });

  let cq = 1 + major - minor;

  // clamp according to law
  if (cq > 1.5) cq = 1.5;
  if (cq < 0.5) cq = 0.5;

  return Number(cq.toFixed(2));
}