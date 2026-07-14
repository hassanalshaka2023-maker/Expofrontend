import { memo } from "react";
import { getBoothVisualVariant } from "./boothKit";
import StandardExhibitionBooth from "./StandardExhibitionBooth";
import CornerExhibitionBooth from "./CornerExhibitionBooth";
import IslandExhibitionBooth from "./IslandExhibitionBooth";
import PremiumExhibitionBooth from "./PremiumExhibitionBooth";
import TechnologyExhibitionBooth from "./TechnologyExhibitionBooth";

/* ExhibitionBooth — chooses a visual variant deterministically (see
 * getBoothVisualVariant) and renders it. Booth data + handlers are forwarded
 * untouched, so interaction / selection / reservation behaviour is identical
 * across every variant. */
const VARIANT_COMPONENTS = {
  standard: StandardExhibitionBooth,
  corner: CornerExhibitionBooth,
  island: IslandExhibitionBooth,
  premium: PremiumExhibitionBooth,
  technology: TechnologyExhibitionBooth,
};

function ExhibitionBooth(props) {
  // props: { id, position, status, companyDetails, onSelect, allowAllClicks, selected, index }
  const variant = getBoothVisualVariant(
    { boothId: props.id, position3D: props.position },
    props.index
  );
  const Variant = VARIANT_COMPONENTS[variant] || StandardExhibitionBooth;
  return <Variant {...props} variant={variant} />;
}

export default memo(ExhibitionBooth);
