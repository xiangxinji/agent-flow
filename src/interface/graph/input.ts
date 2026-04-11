
export type Input = RefInput  | RunningInput | LiteralInput

/**
 * 运行时的输入参数 
 */
export type RunningInput = {
    type : 'root'
    path : string 
}
/**
 * 其它节点的输出参数 
 */
export type RefInput = {
    type : 'ref'
    path: string
}


/**
 * 固定值的输入参数
 */
export type LiteralInput = {
    type : 'literal'
    value : any
}
