import { ICONS } from "./icons";
import type { IconName } from "./icons";

type IconProps = {
  name: IconName;
  className?: string;
  size?: number;
};

const DEFAULT_SIZE = 24;

export const Icon = ({
  name,
  className = "",
  size = DEFAULT_SIZE,
}: IconProps) => {
  const IconPath = ICONS[name];

  if (!IconPath) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <IconPath />
    </svg>
  );
};
