module.exports = {
    port: "3000",
    dest: "docs",
    ga: "UA-85414008-1",
    base: "/",
    markdown: {
        externalLinks: {
            target: '_blank', rel: 'noopener noreferrer'
        }
    },
    locales: {
        "/": {
            lang: "zh-CN",
            title: "伍涛的博客",
            description: "我涛哥哥怕过谁"
        }
    },
    head: [["link", {rel: "icon", href: `/img/logo.png`}]],
    themeConfig: {
        repo: "baomidou/mybatis-plus",
        docsRepo: "baomidou/mybatis-plus-doc",
        editLinks: true,
        locales: {
            "/": {
                label: "简体中文",
                editLinkText: "在 GitHub 上编辑此页",
                lastUpdated: "上次更新",
                nav: [
                    {
                        text: "",
                        link: "/guide/"
                    },
                    {
                        text: "springboot",
                        link: "/springboot/"
                    },
                    {
                        text: "springcloud",
                        link: "/springcloud/"
                    }
                ],
                sidebar: {
                    "/guide/": genGuideSidebar(true),
                    "/config/": genConfigSidebar(true)
                }
            }
        }
    }
};

function genGuideSidebar(isZh) {
    return [
        {
            title: isZh ? "爱购商城" : "AIGOU",
            collapsable: false,
            children: ["", "day01","day02"]
        }
    ]
}

function genConfigSidebar(isZh) {
    return [
        {
            title: isZh ? "配置" : "Config",
            collapsable: false,
            children: ["", "generator-config"]
        }
    ]
}
