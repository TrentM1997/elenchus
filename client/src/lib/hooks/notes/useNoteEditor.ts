import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDispatch } from "react-redux";
import {
  draftNote,
  TakingNoteState,
  WrittenNote,
} from "@/state/Reducers/Investigate/articles/NoteTaking";
import type { Editor, JSONContent } from "@tiptap/core";
import { AppDispatch } from "@/state/store";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import { useEffect, useRef } from "react";

const EMPTY_DOCUMENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

type UseNotesEditorParams = {
  current: Extract<TakingNoteState, { status: "open" } | { status: "draft" }>;
};

type NotesEditorHook = {
  editor: Editor;
  handleContainerClick: () => void;
};

export const useNoteEditor = ({
  current,
}: UseNotesEditorParams): NotesEditorHook => {
  const currentRef = useRef<UseNotesEditorParams["current"]>(current);
  currentRef.current = current;
  const activeNoteId = current.status === "draft" ? current.data.noteId : null;
  const dispatch = useDispatch<AppDispatch>();

  function newOrContinuedNote(
    value: JSONContent,
    current: UseNotesEditorParams["current"],
  ): WrittenNote {
    switch (current.status) {
      case "open": {
        return {
          noteId: crypto.randomUUID(),
          content: value,
        };
      }
      case "draft": {
        return {
          noteId: current.data.noteId,
          content: value,
        };
      }
      default: {
        return assertNever(current);
      }
    }
  }

  const handleContent = (editor: Editor) => {
    const value = editor.getJSON();
    const note = newOrContinuedNote(value, currentRef.current);
    dispatch(draftNote({ status: "draft", data: note }));
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      handleContent(editor);
    },
  });

  const handleContainerClick = () => {
    if (editor && !editor.isFocused) {
      editor.commands.focus("end", { scrollIntoView: undefined });
    }
  };

  useEffect(() => {
    const active = currentRef.current;

    const content =
      active.status === "draft" ? active.data.content : EMPTY_DOCUMENT;

    editor.commands.setContent(content, {
      emitUpdate: false,
    });
  }, [editor, activeNoteId]);

  return {
    editor,
    handleContainerClick,
  };
};
