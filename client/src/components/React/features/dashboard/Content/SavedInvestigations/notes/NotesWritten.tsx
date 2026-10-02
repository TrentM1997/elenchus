import type { NoteSchemaType } from "@elenchus/contracts/schemas/investigations/NoteSchema";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useId } from "react";

export default function NotesWritten({ notes }: { notes: NoteSchemaType[] }) {
  return (
    <ol className="m-0 list-none space-y-5 p-0">
      {notes.map((note, index) => (
        <li key={note.id}>
          <SavedNote note={note} index={index} />
        </li>
      ))}
    </ol>
  );
}

function SavedNote({ note, index }: { note: NoteSchemaType; index: number }) {
  const headingId = useId();
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2] } })],
    content: note.content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "break-normal outline-none",
        "aria-label": `Saved note ${index + 1}`,
      },
    },
  });

  useEffect(() => {
    editor?.commands.setContent(note.content, { emitUpdate: false });
  }, [editor, note.content]);

  return (
    <article aria-labelledby={headingId} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-6 sm:px-8 sm:py-8">
      <h3 id={headingId} className="mb-5 border-b border-white/10 pb-4 text-xs font-medium uppercase tracking-widest text-blue-300">
        Note {String(index + 1).padStart(2, "0")}
      </h3>
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none text-zinc-300 prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-zinc-100 prose-h1:text-2xl prose-h2:text-xl prose-p:leading-7 prose-a:text-blue-300 prose-a:underline prose-blockquote:border-blue-400/50 prose-blockquote:text-zinc-300 prose-strong:text-zinc-100 prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:bg-black/20 prose-li:marker:text-zinc-500 [&_.tiptap>:first-child]:mt-0 [&_.tiptap>:last-child]:mb-0"
      />
    </article>
  );
}
