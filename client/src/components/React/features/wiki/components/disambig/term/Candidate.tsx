type Candidate = {
  title: string;
  extract: string;
  thumbnail: string | null;
  lastUpdated: string | null;
  pageid: number;
  url: string;
};
interface CandidateProps {
  candidate: Candidate;
}

export default function Candidate({
  candidate,
}: CandidateProps): JSX.Element | null {
  if (!candidate) return null;

  return (
    <div
      id={`${candidate.pageid}`}
      aria-label="possible meaning"
      className="flex items-center justify-start w-full h-fit overflow-y-auto"
    >
      <div className="w-full h-auto">
        <p className="text-white font-light tracking-tight text-sm">
          {candidate.extract}
        </p>
      </div>
    </div>
  );
}
