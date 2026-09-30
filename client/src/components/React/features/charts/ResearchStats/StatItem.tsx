import { StatItemLabel } from "./StatBreakdown";
import { useStatInterval } from "@/lib/hooks/dashboard/rendering/useStatInterval";

export default function StatItem({
  label,
  target,
}: {
  label: StatItemLabel;
  target: number;
}) {
  const { count, ref } = useStatInterval(target);

  return (
    <div
      className="flex flex-col gap-y-3 lg:border-l border-white/30 pl-6"
      ref={ref}
    >
      <dt className="mt-2 text-sm text-white">{label}</dt>
      <dd className="order-first text-3xl font-semibold tracking-tight text-white">
        {count}%
      </dd>
    </div>
  );
}
