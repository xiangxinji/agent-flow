
export type Input = RefInput | LiteralInput | TemplateInput


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

/**
 * 模板类型的输入参数
 */
export type TemplateInput = {
    type : 'template'
    template: string
}
