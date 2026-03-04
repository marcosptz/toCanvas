# 📄 JS-PDF Library (toCanvas)

Uma biblioteca leve e poderosa em JavaScript para criação de documentos e etiquetas de alta resolução utilizando a API Canvas do HTML5. Ideal para projetos que exigem precisão de layout, como etiquetas térmicas, relatórios técnicos e documentos prontos para impressão.

## 🚀 Principais Recursos

* **Resolução Profissional:** Escala padrão de 300 DPI (escala 11.811), garantindo nitidez absoluta em impressões físicas.
* **Impressão de Múltiplas Páginas:** Suporte nativo para gerar um documento único a partir de vários canvases.
* **Sistema de Zoom Inteligente:** Zoom visual via CSS que preserva a qualidade dos pixels internos.
* **Performance Otimizada:** Método de impressão via `Blob` e `Async/Await` para lidar com documentos extensos sem travar o navegador.
* **Layout Centralizado:** Visualizador estilo "PDF Reader" com centralização automática e sombras para profundidade.

---

## 🛠️ Como Usar

### Instalação e Inicialização

Basta incluir o arquivo `pdf.js` no seu projeto e inicializar a classe apontando para um elemento de container:

```javascript
const doc = new Pdf('meu-container', {
    scale: 11.811,         // Otimizado para 300 DPI
    paper_width: 210,      // Largura em mm (A4)
    paper_height: 297,     // Altura em mm (A4)
    overflow_y: 'auto'     // Scroll vertical
});

```

### Comandos de Desenho

A biblioteca utiliza coordenadas em milímetros, facilitando o design de documentos reais:

```javascript
// Adicionar um texto
doc.text('Relatório de Vendas', 23, 12, {
    font_size: '20',
    font_text: 'Arial',
    font_color: '#000000',
    font_style: 'bold',
    font_weight: 'italic'
});

doc.roundedRect(5, 5, 100, 60, {radius: 2, color: '#000000'});

// Desenhar um retângulo (ex: borda de etiqueta)
doc.rect(10, 12, 8, 8, {color: 'rgb(14, 37, 138, 0.5)', rotation: 45});

// Desenha uma linha
doc.line(10, 30, 95, 30);

// Desenha um círculo preenchido, com a propriedade fill como true
doc.circle(10, 40, 2, {fill: true});

// Desenha um círculo normal
doc.circle(10, 50, 2);

doc.text('Vendas à vista', 20, 38, {font_size: 20, font_text: 'Arial'});

doc.text('Vendas à prazo', 20, 48, {font_size: 20, font_text: 'Arial', fill: false});

// Limpar o canvas atual com o método clear() após 5 segundos
setTimeout(() => doc.clear(), 5000);

```

---

## 🖋️ Principais Métodos de Desenho

A biblioteca converte automaticamente milímetros em pixels com base na escala definida, permitindo que você trabalhe com medidas reais.

### `text(content, x, y, {font_size, font_text, font_style, font_weight, font_color})`

Desenha um texto no documento.

* **content**: String com o texto.
* **x / y**: Coordenadas em milímetros.
* **font_size**: Tamanho da fonte (ex: `'12pt'`).
* **font_text**: Estilo da fonte (ex: `'Arial'`).
* **font_style**: Estilo da fonte (ex: `'bold'`).
* **font_weight**: Estilo da fonte (ex: `'italic'`).
* **font_color**: Cor em Hex ou RGB (ex: `'#000000'` ou `'rgba(0, 0, 0, 1)'`).

### `rect(x, y, width, height, {esp, color, rotation})`

Cria um retângulo (útil para bordas de etiquetas ou divisores).

* **width / height**: Dimensões em milímetros.
* **esp**: Espessura da linha.
* **color**: Cor.
* **rotation**: Permite rotacionar.

### `roundedRect(x, y, width, height, {radius, esp, fill, color})`

Cria um retângulo com cantos arredondados. Este método permite definir um raio de curvatura para suavizar as bordas.

* **radius**: O raio do arredondamento em milímetros. Se definido como 0, comporta-se como um `rect` comum.
* **esp**: Espessura da borda.
* **color**: Cor do traço.

### `clear()`

Limpa o conteúdo do canvas atual. Útil para resetar a página antes de um novo desenho.

---

## 🔍 Gerenciamento de Zoom

O zoom foi projetado para ser fluido. Ele altera a escala de visualização sem a necessidade de redesenhar os elementos, mantendo a performance alta.

```javascript
// Aumentar o zoom para 150%
doc.setZoom(1.5);

// Retornar para o tamanho original (100%)
doc.setZoom(1.0);

```

## 🔍 Visualização e Interface

A biblioteca gerencia automaticamente o "palco" de visualização para o usuário.

### `setZoom(value)`

Ajusta o tamanho de exibição dos canvases sem perder a resolução interna.

* `doc.setZoom(0.5)` - 50% do tamanho.
* `doc.setZoom(1.5)` - 150% do tamanho.

### `updateZoom()`

Método interno chamado pelo `setZoom` que reaplica as regras de CSS para manter as páginas centralizadas e com sombras de profundidade.

---

## 📑 Suporte a Múltiplas Páginas

A biblioteca foi desenhada para que cada elemento com a classe `.canvas` dentro do container principal seja tratado como uma nova página no documento final. O método de impressão insere automaticamente quebras de página (`page-break-after: always`) entre cada um deles.

---

## 🖨️ Métodos de Impressão

A biblioteca oferece dois caminhos para impressão, permitindo flexibilidade total:

### 1. `print(title)`

Método clássico baseado em DataURL. Excelente para documentos curtos e compatibilidade máxima.

```javascript
doc.print('Meu Documento');

```

### 2. `optimizedPrint(title)` **(Alta Performance)**

Utiliza tecnologia de `Blobs` binários e processamento assíncrono. Ideal para relatórios com muitas páginas (60+ páginas) por economizar memória RAM e abrir a janela de impressão mais rapidamente.

```javascript
doc.optimizedPrint('Relatório Pesado');

```

---

## 📐 Especificações Técnicas

| Propriedade | Valor Padrão | Descrição |
| --- | --- | --- |
| **Escala** | 11.811 | Converte 1mm para pixels reais (300 DPI). |
| **Container** | Flexbox | O `box` centraliza automaticamente as páginas. |
| **Unidade** | Milímetros | Todos os métodos (`text`, `rect`, etc) aceitam mm. |
| **Memória** | Blobs | Gerenciamento automático de memória no `optimizedPrint`. |

---

## 📝 Contribuição

1. Faça o Fork do projeto ([https://github.com/marcosptz/xadrez1](https://github.com/marcosptz/xadrez1))
2. Crie uma Branch para sua Feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add NovaFeature'`)
4. Push para a Branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

*Desenvolvido com foco em precisão e performance para aplicações web modernas.*
