import { memo } from "react";
import { getBoothVisualVariant } from "./boothKit";
import GardenCanopyBooth from "./booths/GardenCanopyBooth";
import ColorfulMarketBooth from "./booths/ColorfulMarketBooth";
import ModernTradeBooth from "./booths/ModernTradeBooth";
import WoodenPavilionBooth from "./booths/WoodenPavilionBooth";
import PremiumExhibitionBooth from "./booths/PremiumExhibitionBooth";
import OpenIslandBooth from "./booths/OpenIslandBooth";

/* ExhibitionBooth — picks one of the six coordinated bright booth families
 * deterministically (see getBoothVisualVariant) and renders it. Booth data +
 * handlers are forwarded untouched, so interaction / selection / reservation
 * behaviour is identical across every family and every role. */
const FAMILY_COMPONENTS = {
  "garden-canopy": GardenCanopyBooth,
  "colorful-market": ColorfulMarketBooth,
  "modern-trade": ModernTradeBooth,
  "wooden-pavilion": WoodenPavilionBooth,
  premium: PremiumExhibitionBooth,
  "open-island": OpenIslandBooth,
};

function ExhibitionBooth(props) {
  // props: { id, position, status, companyDetails, onSelect, allowAllClicks, selected, index }
  const variant = getBoothVisualVariant(
    { boothId: props.id, position3D: props.position },
    props.index
  );
  const Variant = FAMILY_COMPONENTS[variant] || GardenCanopyBooth;
  return <Variant {...props} variant={variant} />;
}

export default memo(ExhibitionBooth);
