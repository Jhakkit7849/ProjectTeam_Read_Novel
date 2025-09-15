import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'


export default function TiptapEditor({ value='', onChange }){
const editor = useEditor({
extensions:[StarterKit],
content:value,
onUpdate: ({ editor }) => onChange(editor.getHTML())
})
useEffect(()=>{ if(editor && value!==editor.getHTML()) editor.commands.setContent(value||'') },[value])
return <div style={{background:'#fff', border:'1px solid #e7daef', borderRadius:12, padding:12}}><EditorContent editor={editor} /></div>
}