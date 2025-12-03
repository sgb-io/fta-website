interface HalsteadMetrics {
  uniq_operators: number;
  uniq_operands: number;
  total_operators: number;
  total_operands: number;
  program_length: number;
  vocabulary_size: number;
  volume: number;
  difficulty: number;
  effort: number;
  time: number;
  bugs: number;
}

export interface AnalysisResult {
  fta_score: number;
  cyclo: number;
  line_count: number;
  halstead_metrics: HalsteadMetrics;
}
