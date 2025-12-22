import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import Placeholder from "@tiptap/extension-placeholder";
import { TipTapProps } from "@/env";
import EditorControls from "./EditorControls";
import { useEffect, useRef } from "react";
import styles from './StepsEditor.module.css';

export default function StepsEditor({ setterFunction, context, id }: TipTapProps): JSX.Element | null {
    const dispatch = useDispatch<AppDispatch>();

    const step = useSelector((state: RootState) => state.investigation.stepper.step);
    const draftRef = useRef<string | null>(null);
    const debounce = useRef<number | null>(null);
    const placeholderText = step === 0 ? 'type the idea to challenge here...' : 'type premises here...'

    const handleContent = () => {
        debounce.current = window.setTimeout(() => {
            draftRef.current = editor.getText();
            dispatch(setterFunction(draftRef.current));
        }, 300);
        debounce.current = null;
    };

    useEffect(() => {

        return () => {
            if (debounce.current !== null) {
                clearTimeout(debounce.current);
            };
        };
    }, []);



    const editor: Editor = useEditor({
        content: context && context.trim().length > 0 ? context : null,
        onCreate: ({ editor }) => {
            requestAnimationFrame(() => editor.commands.focus('end'))
        },
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2]
                }
            }),
            Placeholder.configure({
                placeholder: ({ editor }) => {
                    return editor.isEmpty ? placeholderText : ''
                }
            }),
        ],
        editorProps: {
            attributes: {
                class: 'tiptap focus:outline-none'
            }
        }

    });


    if (!editor) {
        return null
    };

    editor.on('update', handleContent)

    const handleContainerClick = () => {
        if (editor && !editor.isFocused) {
            editor.commands.focus('end', null)
        }
    }

    return (
        <div className={`${(id === 'takeaway') ? 'h-full' : '2xl:max-h-[16.5rem] xl:h-[15rem] lg:h-[14.5rem] md:h-52 sm:h-44 h-36'}
            w-full max-w-168
         box-border mx-auto`
        }
        >
            <EditorControls editor={editor} />
            <div onClick={handleContainerClick} className="h-full w-full box-border max-w-80 md:max-w-full overflow-hidden">
                <EditorContent style={{ textAlign: 'left', verticalAlign: 'top', minHeight: '90%', height: '100%', color: '#ffffff', maxWidth: '100%' }} editor={editor}
                    className={`${styles.editor}
                    text-white whitespace-pre-wrap break-words text-xs 
                    sm:text-sm xl:text-lg focus:outline-none px-2 focus:border-none 
                    font-light font-serif tracking-tight cursor-text
                    w-full overflow-y-scroll no-scrollbar h-full prose`}
                />
            </div>
        </div>
    )
};

