import Editor from "@monaco-editor/react";
import "./CodeEditor.css";

interface CodeEditorProps {
  code: string;
  language: string;
  input: string;
  onChange: (value: string) => void;
  onInputChange: (value: string) => void;
}

const CodeEditor = ({
  code,
  language,
  input,
  onChange,
  onInputChange,
}: CodeEditorProps) => {
  return (
    <div className="code-editor-container">
      {/* =================================================
          MONACO EDITOR
      ================================================= */}

      <Editor
        height="500px"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={(value) => {
          onChange(value ?? "");
        }}
        options={{
          minimap: {
            enabled: false,
          },

          fontSize: 16,

          automaticLayout: true,

          scrollBeyondLastLine: false,

          wordWrap: "on",

          tabSize: 2,

          insertSpaces: true,

          renderWhitespace: "selection",

          padding: {
            top: 12,
            bottom: 12,
          },

          suggestOnTriggerCharacters: true,

          quickSuggestions: true,

          parameterHints: {
            enabled: true,
          },
        }}
      />

      {/* =================================================
          INPUT PANEL
      ================================================= */}

      <div className="judge-panel">
        <div className="panel-title">
          Input
        </div>

        <textarea
          value={input}
          onChange={(e) => {
            onInputChange(e.target.value);
          }}
          placeholder="Enter your input..."
          className="input-area"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default CodeEditor;