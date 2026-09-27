import { assertNever } from "@/lib/helpers/asserts/assertNever";
import type { WikiResponseSchemaType } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";
import DisambigExtract from "./disambig/DisambigExtract";
import StandardExtract from "./standard/StandardExtract";
import ExtractError from "./errors/ExtractError";

export default function RenderWikiExtractByKind({
  extract,
}: {
  extract: WikiResponseSchemaType;
}) {
  switch (extract.kind) {
    case "summary": {
      return <StandardExtract summary={extract} />;
    }
    case "disambiguation": {
      return <DisambigExtract disambig={extract} key="disambing" />;
    }
    case "error": {
      return <ExtractError key={"errormessage"} />;
    }

    default: {
      return assertNever(extract);
    }
  }
}
