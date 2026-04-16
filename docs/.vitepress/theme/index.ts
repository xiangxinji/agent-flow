import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ParticlesBackground from '../components/ParticlesBackground.vue'
import WorkflowDecoration from '../components/WorkflowDecoration.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => [
        h(ParticlesBackground),
        h(WorkflowDecoration)
      ]
    })
  },
  enhanceApp({ app }) {
    // 注册全局组件
  }
} satisfies Theme
