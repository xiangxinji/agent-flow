import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AgentFlow',
  description: '强大的工作流引擎 - 基于节点的工作流执行系统',
  lang: 'zh-CN',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AgentFlow',
    
    nav: [
      { text: '指南', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: 'API 参考', link: '/api/', activeMatch: '/api/' },
      { text: '示例', link: '/examples/', activeMatch: '/examples/' },
      {
        text: '相关链接',
        items: [
          { text: 'GitHub', link: 'https://github.com' },
          { text: '更新日志', link: '/changelog' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' }
          ]
        },
        {
          text: '核心概念',
          items: [
            { text: '节点', link: '/guide/nodes' },
            { text: '边', link: '/guide/edges' },
            { text: '工作流', link: '/guide/workflow' },
            { text: '执行器', link: '/guide/executors' }
          ]
        },
        {
          text: '进阶',
          items: [
            { text: '自定义节点', link: '/guide/custom-nodes' },
            { text: '状态管理', link: '/guide/state-management' },
            { text: '错误处理', link: '/guide/error-handling' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '概览', link: '/api/' },
            { text: '节点接口', link: '/api/node-interfaces' },
            { text: '执行器 API', link: '/api/executor-api' },
            { text: '工作流引擎', link: '/api/workflow-engine' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '概览', link: '/examples/' },
            { text: 'Agent 示例', link: '/examples/agent-example' },
            { text: '分支示例', link: '/examples/branch-example' },
            { text: '迭代器示例', link: '/examples/iterator-example' },
            { text: '并行示例', link: '/examples/parallel-example' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2026-present AgentFlow Team'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  markdown: {
    lineNumbers: true
  },

  vite: {
    ssr: {
      noExternal: ['@vueuse/core']
    }
  }
})
