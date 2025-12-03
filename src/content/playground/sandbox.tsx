"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Callout } from "nextra/components";
import dedent from "dedent";
import init, { analyze_file_wasm } from "fta-wasm";

import "./sandbox.css";

import type { AnalysisResult } from "./types";

const DEFAULT_CODE_SAMPLE = dedent`
  // Paste your TypeScript code here

  function add(a: number, b: number) {
    return a + b;
  }
  
  add(2, 4);
`;

// fta-wasm does not have the retry logic; replicate it here
async function runFta(sourceCode: string) {
  try {
    return analyze_file_wasm(sourceCode, true, false);
  } catch (e) {
    return analyze_file_wasm(sourceCode, false, false);
  }
}

function getFtaAssessment(score: number | undefined) {
  if (!score) return "";

  if (score > 60)
    return <span className="output-needs-improvement">Needs Improvement</span>;

  if (score > 50)
    return <span className="output-could-be-better">Could be better</span>;

  return <span className="output-ok">OK - Considered Maintainable</span>;
}

function Playground() {
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
        "Unable to parse and analyze input - please ensure you supplied valid TypeScript or JavaScript code. If using JSX, ensure you aren't mixing ambiguous syntax."
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
      <span>{error}</span>
      <br />
      <br />
      <span>
        If you believe this is a bug, please{" "}
        <a
          className="error-issue-link"
          target="_blank"
          href="https://github.com/sgb-io/fta/issues/new"
        >
          file an issue on GitHub
        </a>
        .
      </span>
    </Callout>
  ) : (
    <div style={{ marginTop: 10 }} className="sandbox-output">
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
          <span style={{ fontSize: 18, margin: "10px 0", display: "block" }}>
            {getFtaAssessment(output?.fta_score)}
          </span>
        </li>
      </ul>
      <table className="halstead-table">
        <thead>
          <th>Item</th>
          <th>Result</th>
        </thead>
        <tbody>
          <tr>
            <td>Num. lines</td>
            <td>{output?.line_count}</td>
          </tr>
          <tr>
            <td>Cyclomatic Complexity</td>
            <td>{output?.cyclo}</td>
          </tr>
          <tr>
            <td colSpan={2}>Halstead</td>
          </tr>
          <tr>
            <td>Unique / Total Operators</td>
            <td>
              {output?.halstead_metrics.uniq_operators} (
              {output?.halstead_metrics.total_operators})
            </td>
          </tr>
          <tr>
            <td>Unique / Total Operands</td>
            <td>
              {output?.halstead_metrics.uniq_operands} (
              {output?.halstead_metrics.total_operands})
            </td>
          </tr>
          <tr>
            <td>Length</td>
            <td>{output?.halstead_metrics.program_length}</td>
          </tr>
          <tr>
            <td>Vocab Size</td>
            <td>{output?.halstead_metrics.vocabulary_size}</td>
          </tr>
          <tr>
            <td>Volume</td>
            <td>{output?.halstead_metrics.volume.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Difficulty</td>
            <td>{output?.halstead_metrics.difficulty.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Effort</td>
            <td>{output?.halstead_metrics.effort.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Time</td>
            <td>{output?.halstead_metrics.time.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Bugs</td>
            <td>{output?.halstead_metrics.bugs.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="sandbox-container">
      <div className="sandbox-left">
        <h2 style={{ fontSize: 18 }}>Input</h2>
        <textarea
          className="sandbox-textarea"
          value={codeContent}
          onChange={(e) => onUpdateCodeContent(e.target.value)}
          onBlur={(e) => onUpdateCodeContent(e.target.value)}
        />
      </div>
      <div className="sandbox-right">
        <h2 style={{ fontSize: 18 }}>Output</h2>
        {analysisOutput}
        <div className="output-tip">
          <Callout emoji="💡" type="info">
            Lower scores for individual files are achieved by:
            <ul className="output-tip-list">
              <li>Keeping the number of logical paths to a minimum</li>
              <li>Reducing the number of entities or operations in the code</li>
              <li>Avoiding single files that contain 1000s of lines</li>
            </ul>
          </Callout>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Playground), {
  ssr: false,
});
