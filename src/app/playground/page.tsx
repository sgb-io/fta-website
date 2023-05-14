"use client";

import { useState, useEffect, useCallback } from "react";
import dedent from "dedent";
import init, { analyze_file_wasm } from "fta-wasm";

import type { AnalysisResult } from "../types";

const DEFAULT_CODE_SAMPLE = dedent`
  function add(a: number, b: number) {
    return a + b;
  }

  add(2, 4); // 6
`;

let firstRes: string;

async function runFta(sourceCode: string) {
  return analyze_file_wasm(sourceCode);
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
    <div>Warning - {error}</div>
  ) : (
    <div>
      <ul>
        <li>FTA Score: {output?.fta_score.toFixed(0)}</li>
        <li>Num. lines: {output?.line_count}</li>
        <li>
          Halstead:
          <ul>
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
    <div>
      <h2>Input</h2>
      <textarea
        value={codeContent}
        onChange={(e) => onUpdateCodeContent(e.target.value)}
        style={{
          width: 450,
          height: 300,
        }}
      />
      <h2>Output</h2>
      {analysisOutput}
    </div>
  );
}
