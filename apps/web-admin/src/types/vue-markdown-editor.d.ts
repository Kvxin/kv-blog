declare module '@kangc/v-md-editor' {
    import { App } from 'vue'

    interface VueMarkdownEditor {
        install(app: App): void
        use(theme: any, options?: any): void
        lang: {
            use(lang: string, config: any): void
            add(config: any): void
        }
        themeConfig: {
            markdownParser: {
                render(markdown: string): string
            }
        }
    }

    const VueMarkdownEditor: VueMarkdownEditor
    export default VueMarkdownEditor

    export function xss(options?: any): {
        process(html: string): string
    }
}

declare module '@kangc/v-md-editor/lib/theme/vuepress.js' {
    const vuepressTheme: any
    export default vuepressTheme
}

declare module '@kangc/v-md-editor/lib/theme/github.js' {
    const githubTheme: any
    export default githubTheme
}

declare module '@kangc/v-md-editor/lib/plugins/*' {
    const plugin: any
    export default plugin
}

declare module '@kangc/v-md-editor/lib/preview' {
    import { App } from 'vue'

    interface VMdPreview {
        install(app: App): void
        use(theme: any, options?: any): void
    }

    const VMdPreview: VMdPreview
    export default VMdPreview
}

declare module '@kangc/v-md-editor/lib/codemirror-editor' {
    import { App } from 'vue'

    interface VMdEditor {
        install(app: App): void
        use(theme: any, options?: any): void
    }

    const VMdEditor: VMdEditor
    export default VMdEditor
}