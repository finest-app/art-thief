const quote = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="100%" height="100%" fill="#f8f9fa" rx="15" ry="15"/>
  
  <!-- 装饰性引号符号 -->
  <text x="50" y="80" font-family="Inter" font-size="72" fill="#dee2e6">"</text>
  
  <!-- 主要引言文本 -->
  <text x="50" y="130" font-family="Inter" font-size="24" fill="#495057" style="font-style: italic">
    <tspan x="50" dy="0">If you only read the books that everyone</tspan>
    <tspan x="50" dy="35">else is reading, you can only think what</tspan>
    <tspan x="50" dy="35">everyone else is thinking.</tspan>
  </text>
  
  <!-- 作者署名 -->
  <text x="50" y="320" font-family="Inter" font-size="18" fill="#6c757d">
    — Haruki Murakami
  </text>
  
  <!-- 装饰性下划线 -->
  <line x1="50" y1="340" x2="550" y2="340" 
    stroke="#dee2e6" 
    stroke-width="2"
    stroke-linecap="round"/>
</svg>
`

export default quote
