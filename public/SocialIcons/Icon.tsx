import { ICONS } from "./icons";
import type { IconName } from "./icons";

type IconProps = {
  name: IconName;
  className?: string;
  size?: number;
  color?: string;
};

const DEFAULT_SIZE = 24;

export const Icon = ({
  name,
  className = "",
  size = DEFAULT_SIZE,
  color,
}: IconProps) => {
  const IconPath = ICONS[name];

  if (!IconPath) return null;

  return name !== "instagram" ? (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 48 48`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <IconPath color={color} />
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <IconPath color={color} />
    </svg>
  );
};
