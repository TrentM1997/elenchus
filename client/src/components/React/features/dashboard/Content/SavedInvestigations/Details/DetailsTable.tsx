import ProcessMap from "./ProcessMap";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import { getInvestigationDetialsTableCopy } from "@/lib/helpers/tokens/getInvestigationDetials";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";

export default function DetailsTable({
  investigation,
}: {
  investigation: InvestigationSchemaType;
}) {
  const { investigationDetails } =
    getInvestigationDetialsTableCopy(investigation);

  return (
    <section className="2xl:max-w-7xl xl:max-w-5xl lg:max-w-4xl md:max-w-3xl max-w-2xl">
      <div className="mx-auto 2xl:max-w-7xl lg:py-12 lg:px-0 2xl:py-0 px-2 items-center relative w-full">
        <div className="relative isolate lg:flex-col overflow-hidden bg-gradientdown rounded-4xl px-6 p-10 lg:flex lg:p-20">
          <div className="pb-12 border-b border-white/10">
            <span className="text-white">Inquiry to Conclusion</span>
            <h2 className="text-3xl mt-6 tracking-tight font-light lg:text-4xl text-white">
              Layout of your research{" "}
              <span className="block text-zinc-400">from beginning to end</span>
            </h2>
          </div>
          <ErrorBoundary>
            <ProcessMap investigationDetails={investigationDetails} />
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}
