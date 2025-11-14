// src/components/Editor/AnnouncementEditor.jsx
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";

// react-icons
import { FiBold, FiItalic, FiUnderline, FiLink, FiImage } from "react-icons/fi";
import { MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md";
import { MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify } from "react-icons/md";

import styles from "./AnnouncementEditor.module.scss";

// 🔹 кастомное расширение для font-size
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ""),
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

const AnnouncementEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TextStyle,
      FontSize,
      FontFamily.configure({ types: ["textStyle"] }),
      Color,
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className={styles.editorWrapper}>
      {/* 🔹 Toolbar */}
      <div className={styles.toolbar}>
        {/* Font Family */}
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          defaultValue="Inter"
        >
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier</option>
        </select>

        {/* Font Size */}
        <select
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          defaultValue="16px"
        >
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
        </select>

        {/* Bold / Italic / Underline */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? styles.active : ""}
        >
          <FiBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? styles.active : ""}
        >
          <FiItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? styles.active : ""}
        >
          <FiUnderline />
        </button>

        {/* Text Color */}
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />

        {/* Align */}
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <MdFormatAlignLeft />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <MdFormatAlignCenter />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <MdFormatAlignRight />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          <MdFormatAlignJustify />
        </button>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? styles.active : ""}
        >
          <MdFormatListBulleted />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? styles.active : ""}
        >
          <MdFormatListNumbered />
        </button>

        {/* Link */}
        <button
          onClick={() => {
            const url = prompt("Enter link:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={editor.isActive("link") ? styles.active : ""}
        >
          <FiLink />
        </button>

        {/* Image */}
        <button
          onClick={() => {
            const url = prompt("Enter image URL:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <FiImage />
        </button>
      </div>

      {/* 🔹 Editor */}
      <EditorContent editor={editor} className={styles.editorBox} />
    </div>
  );
};

export default AnnouncementEditor;