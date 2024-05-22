import React, { useState } from "react";
import { OpenApiVariableQuery } from "types";


interface OpenApiVariableQueryEditorProps {
  query: OpenApiVariableQuery;
  onChange: (query: OpenApiVariableQuery, definition: string) => void;
}

const OpenApiVariableQueryEditor = ({query, onChange}: OpenApiVariableQueryEditorProps) => {
  const [state, setState] = useState(query);

  const saveQuery = () => {
    onChange(state, `${state.query} (${state.namespace})`);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });

  return (
    <>
      <div className="gf-form">
        <span className="gf-form-label width-10">Namespace</span>
        <input
          name="namespace"
          className="gf-form-input"
          onBlur={saveQuery}
          onChange={handleChange}
          value={state.namespace}
        />
      </div>
      <div className="gf-form">
        <span className="gf-form-label width-10">Query</span>
        <input
          name="rawQuery"
          className="gf-form-input"
          onBlur={saveQuery}
          onChange={handleChange}
          value={state.query}
        />
      </div>
    </> 
  );
}

export default OpenApiVariableQueryEditor;
