---
home: true
heroImage: /img/logo.png
actionText: 快速开始 →
actionLink: /guide/
features:
- title: 润物有声
  details: 只做增强不做改变，引入它不会对现有工程产生影响，如丝般顺滑。
- title: 效率至上
  details: 只需简单配置，即可快速进行 CRUD 操作，从而节省大量时间。
footer: Apache License 2.0 | © 2016-2018 baomidou
---

### 当前最新版本

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus</artifactId>
    <version>latest-version</version>
</dependency>
```

<p align="center">
Hosted by <a href="https://pages.coding.me" target="_blank" style="font-weight:bold">Coding Pages</a> & <a href="https://pages.github.com" target="_blank" style="font-weight:bold">Github Pages</a>  & <a href="http://www.jetbrains.com" target="_blank" style="font-weight:bold">Idea</a>
</p>

<script>
export default {
  mounted () {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", "https://img.shields.io/maven-central/v/com.baomidou/mybatis-plus.json", false)
    xmlHttp.send(null)
    var versionInfo = JSON.parse(xmlHttp.responseText).value.replace('v', '')
    var codeNodeList = document.querySelectorAll('code')
    for (var i = 0; i < codeNodeList.length; i++) {
        codeNodeList[i].innerHTML = codeNodeList[i].innerHTML.replace('latest-version', versionInfo)
    }
  }
}
</script>
