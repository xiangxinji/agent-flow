
export type Input = RefInput  | RunningInput

/**
 * 运行时的输入参数 
 */
export type RunningInput = {
    type : 'running'
    path : string 
}
/**
 * 其它节点的输出参数 
 */
export type RefInput = {
    type : 'ref'
    path: string
}

