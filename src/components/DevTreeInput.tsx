import type { DevTreeLink } from "@/types";

type LinkProps = {
  link: DevTreeLink;
};

export default function DevTreeInput({ link }: LinkProps) {
  return (
    <div className="bg-white shadow-sm p-5 flex items-center gap-5">
      <div
        className="w-12 h-12 bg-cover"
        style={{ backgroundImage: `url(/social/icon_${link.name}.svg)` }}
      ></div>
      <input type="text" className="flex-1 border border-gray-300 rounded-lg" />
    </div>
  );
}
