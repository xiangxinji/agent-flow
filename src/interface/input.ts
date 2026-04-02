export type InputSource = 
  | { type: 'value'; value: any }                    // 硬编码值
  | { type: 'ref'; path: string }                    // 引用，如 "$.steps.init.output"
  | { type: 'tpl'; template: string };               // 模板，如 "请翻译这段话：{{$.input.text}}"