({
  // Please visit the URL below for more information:
  // https://shd101wyy.github.io/markdown-preview-enhanced/#/extend-parser
  
  onWillParseMarkdown: async function(markdown) {
    let folderName = "";

    // 1. 提取标题并模拟 Hexo 的连字符逻辑 (Slugify)
    const titleMatch = markdown.match(/^title:\s*["']?(.*?)["']?\s*$/m);
    if (titleMatch) {
      folderName = titleMatch[1].trim()
        .replace(/[\s\+]+/g, '-')  // 把空格和 + 变成 -
        .replace(/-+/g, '-');      // 连续的 - 合并为一个
    }

    // 2. 执行替换
    // 添加 ^ 锚点并开启多行模式 (m 标志)，这样它只会匹配【以 ! 开头】或者【空格后紧跟 !】的行
    const newMarkdown = markdown.replace(
      /^(\s*!\[.*?\]\()(?!(?:http|https|\/|[.][\\/]|.*[\\/]))(.+?)(\))/gm,
      (match, p1, p2, p3) => {
        // Windows 环境下本地预览，直接拼接通常比编码更稳
        return `${p1}${folderName}/${p2}${p3}`;
      }
    );

    return newMarkdown;
  },

  onDidParseMarkdown: async function(html) {
    return html;
  },
})