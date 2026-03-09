export function calculateCv(ageRange: string | null): number | null {
  if (!ageRange) return null;

  switch (ageRange) {
    case "<2":
      return 1.0;
    case "2-5":
      return 0.95;
    case "6-9":
      return 0.90;
    case "10-15":
      return 0.85;
    case "16-25":
      return 0.80;
    case "26-40":
      return 0.75;
    case "41-50":
      return 0.65;
    case "51-60":
      return 0.55;
    case ">60":
      return 0.40;
    default:
      return null;
  }
}