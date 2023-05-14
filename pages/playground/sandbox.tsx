"use client";

import { useState, useEffect, useCallback } from "react";
import { Callout } from "nextra-theme-docs";
import dedent from "dedent";
import init, { analyze_file_wasm } from "fta-wasm";

import type { AnalysisResult } from "../../src/app/types";

const DEFAULT_CODE_SAMPLE = dedent`
  // Paste your TypeScript code here

  function add(a: number, b: number) {
    return a + b;
  }
  
  add(2, 4);
`;

async function runFta(sourceCode: string) {
  return analyze_file_wasm(sourceCode);
}

function getFtaAssessment(score: number | undefined) {
  if (!score) return "";

  if (score > 60) return "Needs Improvement";

  if (score > 50) return "Could be better";

  return "OK";
}

export default function Playground() {
  const [error, setError] = useState<string>();
  const [output, setOutput] = useState<AnalysisResult>();
  const [codeContent, setCodeContent] = useState(DEFAULT_CODE_SAMPLE);

  const updateOutput = useCallback(async () => {
    try {
      const output = await runFta(codeContent);
      setError(undefined);
      setOutput(JSON.parse(output) as AnalysisResult);
    } catch (e) {
      console.warn(e);
      setError(
        "Unable to parse and analyze input - please ensure you supplied valid TypeScript."
      );
    }
  }, [codeContent]);

  // Initiate wasm module, trigger first analysis
  useEffect(() => {
    (async () => {
      await init();
      await updateOutput();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onUpdateCodeContent(newContent: string) {
    setCodeContent(newContent);
    await updateOutput();
  }

  const analysisOutput = error ? (
    <Callout type="warning" emoji="⚠️">
      {error}
    </Callout>
  ) : (
    <div style={{ marginTop: 10 }}>
      <ul>
        <li>
          <span style={{ fontSize: 18 }}>
            <span>
              <strong>FTA Score:</strong>
            </span>{" "}
            {output?.fta_score.toFixed(0)} (Lower is better)
          </span>
        </li>
        <li>
          <span style={{ fontSize: 18 }}>
            <span>
              <strong>FTA Assessment</strong>
            </span>{" "}
            {getFtaAssessment(output?.fta_score)}
          </span>
        </li>
        <li>
          <span>
            <strong>Cyclo:</strong>
          </span>{" "}
          {output?.cyclo}
        </li>
        <li>
          <span>
            <strong>Num. lines:</strong>
          </span>{" "}
          {output?.line_count}
        </li>
        <li>
          <span>
            <strong>Halstead:</strong>
          </span>
          <ul
            style={{
              fontSize: 12,
              paddingLeft: 15,
              fontStyle: "italic",
            }}
          >
            <li>Unique Operators: {output?.halstead_metrics.uniq_operators}</li>
            <li>Total Operators: {output?.halstead_metrics.total_operators}</li>
            <li>Unique Operands: {output?.halstead_metrics.uniq_operands}</li>
            <li>Total Operands: {output?.halstead_metrics.total_operands}</li>
            <li>Program Length: {output?.halstead_metrics.program_length}</li>
            <li>Vocabulary Size: {output?.halstead_metrics.vocabulary_size}</li>
            <li>Volume: {output?.halstead_metrics.volume}</li>
            <li>Difficulty: {output?.halstead_metrics.difficulty}</li>
            <li>Effort: {output?.halstead_metrics.effort}</li>
            <li>Time: {output?.halstead_metrics.time}</li>
            <li>Bugs: {output?.halstead_metrics.bugs}</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "70%", marginRight: 20 }}>
        <h2 style={{ fontSize: 18 }}>Input</h2>
        <textarea
          value={codeContent}
          onChange={(e) => onUpdateCodeContent(e.target.value)}
          onBlur={(e) => onUpdateCodeContent(e.target.value)}
          style={{
            width: "100%",
            height: 300,
            padding: 10,
            fontSize: 14,
            outline: "none",
            border: "1px solid gainsboro",
            marginTop: 15,
          }}
        />
      </div>
      <div style={{ width: "30%" }}>
        <h2 style={{ fontSize: 18 }}>Output</h2>
        {analysisOutput}
      </div>
    </div>
  );
}
