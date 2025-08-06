class Pdf {
	constructor(element, props={}) {
		this.scl = typeof props.scale == 'undefined' ? 2.42 : props.scale;
		this.paper_width = typeof props.paper_width == 'undefined' ? this.scale(210) : this.scale(props.paper_width);
		this.paper_height = typeof props.paper_height == 'undefined' ? this.scale(297) : this.scale(props.paper_height);
		this.add_class = typeof props.add_class == 'undefined' ? '' : props.add_class;
		this.overflow_x = typeof props.overflow_x == 'undefined' ? 'auto' : props.overflow_x;
		this.overflow_y = typeof props.overflow_y == 'undefined' ? 'auto' : props.overflow_y;
		this.html = `<div class="box ${this.add_class}" id="box">
						<canvas class="canvas" id="canvas" width="${this.paper_width}px" height="${this.paper_height}px">
							<h3>Seu navegador não tem suporte ao canvas</h3>
						</canvas>
					</div>`;

  		document.getElementById(element).innerHTML = this.html;

		this.element = document.getElementById(element);
		this.element.innerHTML = this.html;
		this.box = document.getElementById('box');
		this.box.style = `width: 100%;
		                  height: 66vh; 
						  overflow-x: ${this.overflow_x} !important;
						  overflow-y: ${this.overflow_y} !important; 
						  border: solid #363636 2px;
						  background-color: #696969;
						`;

		this.canvas = document.getElementById('canvas');
		this.canvas.style = `background-color: #FFFAFA; 
							 border: solid #4F4F4F 1px;`
    	this.ctx = this.canvas.getContext('2d');
		this.obj_dotted = [this.scale(1.2), this.scale(1.2)];
		this.obj_dashed = [this.scale(3.6), this.scale(1.8)];
	}

	/**
	 * Método que desenha uma texto
	 * @param {string} text 
	 * @param {float} x 
	 * @param {float} y 
	 * @param {object} props
	 * *Prorpiedade do parâmetro:*
	 * - font_size: Determina determina o tamanho da fonte do texto, float
	 * - font_text: Determina o tipo de fonte do texto, float
	 * - font_color: Determina a cor do texto, default preto, string
	 * - font_style: Determina o estilo do texto, se tera negrito, string
	 * - font_weight: Determina se o texto sará italico, default preto, string
	 * - rotation: Determina a rotação do texto, a rotação será feita pelo eixo x e y da figura, integer
	 */
	text(text='', x, y, props={}) {
		let font_size = typeof props.font_size == 'undefined' ? this.scale(10)/2.416 : this.scale(props.font_size)/2.416;
		let font_text = typeof props.font_text == 'undefined' ? 'Arial' : props.font_text;
		let font_color = typeof props.font_color == 'undefined' ? '#000000' : props.font_color;
		let font_style = typeof props.font_style == 'undefined' ? 'normal' : props.font_style;
		let font_weight = typeof props.font_weight == 'undefined' ? 'normal' : props.font_weight;
		let fill = typeof props.fill == 'undefined' ? true : props.fill;
		let rotation = typeof props.rotation == 'undefined' ? 0 : props.rotation;
		let size = typeof props.font_size == 'undefined' ? 10 : props.font_size;
		let underlined = typeof props.underlined == 'undefined' ? false : props.underlined;
		let info_text = 0;  // this.ctx.measureText(text);  // Busca informações da largura do texto
		let width_text = 0; // info_text.width*(size*0.021);
		let height_text = size*0.3;
		let width = size*0.3;// info_text.width*(size*0.021); // (0.177*size)*text.length;
		let height = size*0.3;
		let esp = this.scale(0.5);
		let translate_x = 0;
		let translate_y = 0;
		let line = this.scl > 4 ? 0.21 : 0.41;
		let x_line = x;
		let y_line = y;

		x = this.scale(x)+esp*0.8;
		y = this.scale(y)+esp*1.473;
		width = this.scale(width);
		height = this.scale(height);
		translate_x = x + width/2;
		translate_y = y + height/2;
	
		this.ctx.font = `${font_style} ${font_weight} ${font_size}px ${font_text}`;
		this.ctx.fillStyle = font_color;
		this.ctx.save();
		this.ctx.translate(translate_x, translate_y);
		this.ctx.rotate(rotation * Math.PI / 180);
		this.ctx.translate(-translate_x, -translate_y);

		info_text = this.ctx.measureText(text);
		width_text = info_text.width*line;

		// Sublinhando o texto
		if(underlined) this.line(x_line+1, y_line+height_text+1.1, width_text+x_line, y_line+height_text+1.1, {color: font_color});
		
		if(fill) {
			this.ctx.fillText(text, x, y+height);
			this.ctx.restore();
		} else {
			this.ctx.strokeText(text, x, y+height);
			this.ctx.restore();
		}
	}

	/**
	 * **Método que desenha uma figura quadrilátera**
	 * @param {float} x - Posição x da figura
	 * @param {float} y - Posição y da figura
	 * @param {float} width - Largura da figura
	 * @param {float} height - Altura da figura
	 * @param {object} props - Objeto que especifica as propriedades da figura: 
	 * - radius: Determina a curvatura dos cantos, float
	 * - esp: Determina a espessura das linha da figura, float
	 * - color: Determina a cor das linhas, default preto, string
	 * - fill: Determina se a figura vai ter preenchimento, bolean
	 * - fill_color: Determina a cor de preenchimento da figura, default preto, string
	 * - rotation: Determina a rotação da figura, a rotação será feita pelo eixo central da figura
	 */
	roundedRect(x, y, width, height, props={}) {
		let radius = typeof props.radius == 'undefined' || typeof props.radius == 'object' ? 0 : this.scale(props.radius);
		let esp = typeof props.esp == 'undefined' ? this.scale(0.5) : this.scale(props.esp);
		let style_line = typeof props.style_line == 'undefined' ? 0 : props.style_line;
		let color = typeof props.color == 'undefined' ? '#000000' : props.color;  // rgba(0, 0, 0, 1)
		let fill = typeof props.fill == 'undefined' ? false : props.fill;
  		let fill_color = typeof props.fill_color == 'undefined' ? '#000000' : props.fill_color;
  		let rotation = typeof props.rotation == 'undefined' ? 0 : props.rotation;
		let radius_top_left = typeof props.radius == 'object' && typeof props.radius.top_left != 'undefined'  ? this.scale(props.radius.top_left) : radius;
		let radius_top_right = typeof props.radius == 'object' && typeof props.radius.top_right != 'undefined' ? this.scale(props.radius.top_right) : radius;
		let radius_bottom_left = typeof props.radius == 'object' && typeof props.radius.bottom_left != 'undefined' ? this.scale(props.radius.bottom_left) : radius;
		let radius_bottom_right = typeof props.radius == 'object' && typeof props.radius.bottom_right != 'undefined' ? this.scale(props.radius.bottom_right) : radius;
		let translate_x = 0;
		let translate_y = 0;
		let obj_line = [0, 0];

		if(style_line == 1) obj_line = this.obj_dotted;
		if(style_line == 2) obj_line = this.obj_dashed;

		x = this.scale(x)+esp*0.8;
		y = this.scale(y)+esp*0.8;
		width = this.scale(width);
		height = this.scale(height);
		translate_x = x + width/2;
		translate_y = y + height/2;

		this.ctx.save();
		this.ctx.translate(translate_x, translate_y);
		this.ctx.rotate(rotation * Math.PI / 180);
		this.ctx.translate(-translate_x, -translate_y);

		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = esp;
		this.ctx.fillStyle = fill_color;

		this.ctx.setLineDash(obj_line);
		this.ctx.beginPath();
		this.ctx.moveTo(x, y + radius_top_left);  // Radius top-left
		this.ctx.lineTo(x, y + height - radius_bottom_left);  // Radius bottom-left
		this.ctx.quadraticCurveTo(x, y + height, x + radius_bottom_left, y + height);
		this.ctx.lineTo(x + width - radius_bottom_right, y + height);  // Radius bottom-right
		this.ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius_bottom_right);  // Radius bottom-right
		this.ctx.lineTo(x + width, y + radius_top_right);  // Radius top-right
		this.ctx.quadraticCurveTo(x + width, y, x + width - radius_top_right, y);  // Radius top-right
		this.ctx.lineTo(x + radius_top_left, y);  // Radius top-left
		this.ctx.quadraticCurveTo(x, y-0.1, x, y + radius_top_left);  // Radius top-left
		this.ctx.stroke();
		if(fill) this.ctx.fill();
		this.ctx.restore();
	}

	/**
	 * Método que desenha um círculo
	 * @param {float} x - Posição x da figura
	 * @param {float} y - Posição y da figura
	 * @param {float} diameter - Diâmetro do círculo
	 * @param {float} props - Objeto que especifica as propriedades do círculo: 
	 * - color: Determina a cor das linhas, default preto, string;
	 * - esp: Determina a espessura das linha da figura, float;
	 * - fill: Determina se a figura vai ter preenchimento, bolean;
	 * - fill_color: Determina a cor de preenchimento da figura, default preto, string
	 */
  	circle(x=5, y=5, diameter=15, props={}) {
  		let color = typeof props.color == 'undefined' ? '#000000' : props.color;
  		let esp = typeof props.esp == 'undefined' ? this.scale(0.5) : this.scale(props.esp);
  		let fill = typeof props.fill == 'undefined' ? false : props.fill;
  		let fill_color = typeof props.fill_color == 'undefined' ? '#000000' : props.fill_color;
		let style_line = typeof props.style_line == 'undefined' ? 0 : props.style_line;
		let obj_line = [0, 0];

		if(style_line == 1) obj_line = this.obj_dotted;
		if(style_line == 2) obj_line = this.obj_dashed;

		diameter = this.scale(diameter);
		x = this.scale(x)+diameter+esp*0.7;
		y = this.scale(y)+diameter+esp*0.7;

		this.ctx.setLineDash(obj_line);
  		this.ctx.beginPath();
    	this.ctx.arc(x, y, diameter, 0, Math.PI * 2, true);
    	this.ctx.lineWidth = esp;
    	this.ctx.strokeStyle = color;
    	this.ctx.fillStyle = fill_color;
    	this.ctx.stroke();
    	if(fill) this.ctx.fill();
  	}

	/**
	 * Método que desenha uma linha
	 * @param {float} x - Posição x da linha
	 * @param {float} y - Posição y da linha
	 * @param {float} width - Largura de comprimento da linha
	 * @param {float} height - Altura de comprimento da linha
	 * @param {object} props - Objeto que especifica as propriedades da figura: 
	 * - color: Determina a cor das linhas, default preto, string;
	 * - esp: Determina a espessura das linha da figura, float;
	 * - fill: Determina se a figura vai ter preenchimento, bolean;
	 * - fill_color: Determina a cor de preenchimento da figura, default preto, string
	 */	
  	line(x=10, y=10, width=50, height=10, props={}) {
  		let color = typeof props.color == 'undefined' ? '#000000' : props.color;
  		let esp = typeof props.esp == 'undefined' ? this.scale(0.5) : this.scale(props.esp);
		let style_line = typeof props.style_line == 'undefined' ? 0 : props.style_line;
  		let fill = typeof props.fill == 'undefined' ? false : props.fill;
  		let fill_color = typeof props.fill_color == 'undefined' ? '#000000' : props.fill_color;
		let rotation = typeof props.rotation == 'undefined' ? 0 : props.rotation;
		let translate_x = 0;
		let translate_y = 0;
		let obj_line = [0, 0];

		if(style_line == 1) obj_line = this.obj_dotted;
		if(style_line == 2) obj_line = this.obj_dashed;

		x = this.scale(x);
		y = this.scale(y);
		width = this.scale(width);
		height = this.scale(height);
		translate_x = x + width/2;
		translate_y = y + height/2;

		this.ctx.save();
		this.ctx.translate(translate_x, translate_y);
		this.ctx.rotate(rotation * Math.PI / 180);
		this.ctx.translate(-translate_x, -translate_y);

  		this.ctx.lineWidth = esp;
    	this.ctx.strokeStyle = color;
    	this.ctx.fillStyle = fill_color;
		this.ctx.setLineDash(obj_line);
  		this.ctx.beginPath();
	    this.ctx.moveTo(width, height);
	    this.ctx.lineTo(x, y);
	    this.ctx.stroke();
	    if(fill) this.ctx.fill();
		this.ctx.restore();
  	}

	/**
	 * Método que desenha uma figura quadrilátera
	 * @param {float} x - Posição x da linha
	 * @param {float} y - Posição y da linha
	 * @param {float} width - Largura da figura
	 * @param {float} height - Altura d afigura
	 * @param {float} esp - Determina a espessura das linha da figura
	 * @param {string} color - Determina a cor da figura, default preto
	 */
  	rect(x=5, y=5, width=20, height=20, props={}) {
		let color = typeof props.color == 'undefined' ? '#000000' : props.color;
  		let esp = typeof props.esp == 'undefined' ? false : this.scale(props.esp);
  		let rotation = typeof props.rotation == 'undefined' ? 0 : props.rotation;
		let translate_x = 0;
		let translate_y = 0;

		x = this.scale(x);
		y = this.scale(y);
		width = this.scale(width);
		height = this.scale(height);
		esp = this.scale(esp);
		translate_x = x + width/2;
		translate_y = y + height/2;

		this.ctx.save();
		this.ctx.translate(translate_x, translate_y);
		this.ctx.rotate(rotation * Math.PI / 180);
		this.ctx.translate(-translate_x, -translate_y);

	    this.ctx.fillStyle = color;
	    this.ctx.fillRect(x, y, width, height);
	    if(esp) this.ctx.clearRect(x+esp/2, y+esp/2, width-esp, height-esp);
		this.ctx.restore();
  	}

	/**
	 * Método que desenha um triângulo
	 * @param {float} x Posição x da figura
	 * @param {float} y Posição y da figura
	 * @param {float} width Largura da figura
	 * @param {float} height Altura da figura
	 * @param {object} props Objeto que especifica as propriedades da figura
	 */
	triangle(x=5, y=5, width=50, height=50, props={}) {
		let color = typeof props.color == 'undefined' ? '#000000' : props.color;
		let fill_color = typeof props.fill_color == 'undefined' ? '#000000' : props.fill_color;
		let fill = typeof props.fill == 'undefined' ? false : props.fill;
  		let esp = typeof props.esp == 'undefined' ? false : this.scale(props.esp);
		let style_line = typeof props.style_line == 'undefined' ? 0 : props.style_line;
  		let rotation = typeof props.rotation == 'undefined' ? 0 : props.rotation;
		let translate_x = 0;
		let translate_y = 0;
		let obj_line = [0, 0];

		if(style_line == 1) obj_line = this.obj_dotted;
		if(style_line == 2) obj_line = this.obj_dashed;

		x = this.scale(x);
		y = this.scale(y);
		width = this.scale(width);
		height = this.scale(height);
		translate_x = x + width/2;
		translate_y = y + height/2;

		this.ctx.save();
		this.ctx.translate(translate_x, translate_y);
		this.ctx.rotate(rotation * Math.PI / 180);
		this.ctx.translate(-translate_x, -translate_y);

		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = esp;
		this.ctx.fillStyle = fill_color;
		this.ctx.setLineDash(obj_line);
		this.ctx.beginPath();
		// Base do triângulo
		this.ctx.moveTo(width+x, height+y);
        this.ctx.lineTo(x, y+height);
        // Lateral direita
        this.ctx.moveTo(width+x, height+y);
        this.ctx.lineTo(x+(width/2), y);
        // Lateral esquerda
        this.ctx.lineTo(x, y+height);
    
		this.ctx.stroke();
		if(fill) this.ctx.fill();
		this.ctx.restore();
	}

	/**
	 * Método que desenha um tipo de seta
	 * @param {float} x Posição x da figura
	 * @param {float} y Posição y da figura
	 * @param {float} width Largura da figura
	 * @param {float} height Altura da figura
	 * @param {object} props Objeto que especifica as propriedades da figura
	 */
	arrow(x=5, y=5, width=10, height=20, props={}) {
		let color = typeof props.color == 'undefined' ? '#000000' : props.color;
		let fill_color = typeof props.fill_color == 'undefined' ? '#000000' : props.fill_color;
		let fill = typeof props.fill == 'undefined' ? true : props.fill;
  		let esp = typeof props.esp == 'undefined' ? false : this.scale(props.esp);
		let style_line = typeof props.style_line == 'undefined' ? 0 : props.style_line;
  		let rotation = typeof props.rotation == 'undefined' ? 0 : props.rotation;
		let translate_x = 0;
		let translate_y = 0;
		let width_rect = this.scale(width);
		let height_rect = this.scale(height);
		let x_rect = this.scale(x);
		let y_rect = this.scale(y);
		let obj_line = [0, 0];

		if(style_line == 1) obj_line = this.obj_dotted;
		if(style_line == 2) obj_line = this.obj_dashed;

		x = this.scale(x);
		y = this.scale(y);
		width = this.scale(width);
		height = this.scale(height/3);
		translate_x = x_rect + width_rect/2;
		translate_y = y_rect + height_rect/2;

		this.ctx.save();
		this.ctx.translate(translate_x, translate_y);
		this.ctx.rotate(rotation * Math.PI / 180);
		this.ctx.translate(-translate_x, -translate_y);

		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = esp;
		this.ctx.fillStyle = fill_color;
		this.ctx.setLineDash(obj_line);
		this.ctx.beginPath();
		// Base do triângulo
		this.ctx.moveTo(width+x, height+y);
        this.ctx.lineTo(x, y+height);
        // Lateral direita
        this.ctx.moveTo(width+x, height+y);
        this.ctx.lineTo(x+(width/2), y);
        // Lateral esquerda
        this.ctx.lineTo(x, height+y);
    
		this.ctx.stroke();
		if(fill) this.ctx.fill();
		
		// Retângulo
		this.ctx.fillRect(x_rect+width_rect*0.15, y_rect+height_rect/3.02, width_rect*0.7, height_rect*0.666666);
		this.ctx.restore();
	}

	/**
	 * Método que desenha um tipo de seta
	 * @param {float} x Posição x da figura
	 * @param {float} y Posição y da figura
	 * @param {float} width Largura da figura
	 * @param {float} height Altura da figura
	 * @param {object} props Objeto que especifica as propriedades da figura
	 */
	arrowTriangle(x=5, y=5, width=10, height=20, props={}) {
		let color = typeof props.color == 'undefined' ? '#000000' : props.color;
		let fill_color = typeof props.fill_color == 'undefined' ? '#000000' : props.fill_color;
		let fill = typeof props.fill == 'undefined' ? true : props.fill;
  		let esp = typeof props.esp == 'undefined' ? false : this.scale(props.esp);
		let style_line = typeof props.style_line == 'undefined' ? 0 : props.style_line;
  		let rotation = typeof props.rotation == 'undefined' ? 0 : props.rotation;
		let translate_x = 0;
		let translate_y = 0;
		let width_rect = this.scale(width);
		let height_rect = this.scale(height);
		let x_rect = this.scale(x);
		let y_rect = this.scale(y);
		let obj_line = [0, 0];

		if(style_line == 1) obj_line = this.obj_dotted;
		if(style_line == 2) obj_line = this.obj_dashed;

		x = this.scale(x);
		y = this.scale(y);
		width = this.scale(width);
		height = this.scale(height/3);
		translate_x = x_rect + width_rect/2;
		translate_y = y_rect + height_rect/2;

		this.ctx.save();
		this.ctx.translate(translate_x, translate_y);
		this.ctx.rotate(rotation * Math.PI / 180);
		this.ctx.translate(-translate_x, -translate_y);

		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = esp;
		this.ctx.fillStyle = fill_color;
		this.ctx.setLineDash(obj_line);
		this.ctx.beginPath();
		// Base do triângulo
		this.ctx.moveTo(width+x, height+y);
        this.ctx.lineTo(x, y+height);
        // Lateral direita
        this.ctx.moveTo(width+x, height+y);
        this.ctx.lineTo(x+(width/2), y);
        // Lateral esquerda
        this.ctx.lineTo(x, height+y);
    
		this.ctx.stroke();
		if(fill) this.ctx.fill();

		this.ctx.beginPath();
		// Lateral inversa direita
        this.ctx.moveTo(x+width*0.65, y+height-1.5);
        this.ctx.lineTo(x+width*0.5, y+height*3);
        // Lateral inversa esquerda
        this.ctx.lineTo(x+width*0.35, y+height-1.5);
        this.ctx.stroke();
		if(fill) this.ctx.fill();
    
		this.ctx.restore();
	}

	/**
	 * Método que desenha um tipo de seta
	 * @param {float} x Posição x da figura
	 * @param {float} y Posição y da figura
	 * @param {float} width Largura da figura
	 * @param {float} height Altura da figura
	 * @param {object} props Objeto que especifica as propriedades da figura
	 */
	arrowTriRect(x=5, y=5, width=10, height=20, props={}) {
		let color = typeof props.color == 'undefined' ? '#000000' : props.color;
		let fill_color = typeof props.fill_color == 'undefined' ? '#000000' : props.fill_color;
		let fill = typeof props.fill == 'undefined' ? true : props.fill;
  		let esp = typeof props.esp == 'undefined' ? false : this.scale(props.esp);
		let style_line = typeof props.style_line == 'undefined' ? 0 : props.style_line;
  		let rotation = typeof props.rotation == 'undefined' ? 0 : props.rotation;
		let translate_x = 0;
		let translate_y = 0;
		let width_rect = this.scale(width);
		let height_rect = this.scale(height);
		let x_rect = this.scale(x);
		let y_rect = this.scale(y);
		let obj_line = [0, 0];

		if(style_line == 1) obj_line = this.obj_dotted;
		if(style_line == 2) obj_line = this.obj_dashed;

		x = this.scale(x);
		y = this.scale(y);
		width = this.scale(width);
		height = this.scale(height/3);
		translate_x = x_rect + width_rect/2;
		translate_y = y_rect + height_rect/2;

		this.ctx.save();
		this.ctx.translate(translate_x, translate_y);
		this.ctx.rotate(rotation * Math.PI / 180);
		this.ctx.translate(-translate_x, -translate_y);

		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = esp;
		this.ctx.fillStyle = fill_color;
		this.ctx.setLineDash(obj_line);
		this.ctx.beginPath();
		// Base do triângulo
        this.ctx.moveTo(width+x, height+y);
        this.ctx.lineTo(x, y+height);
        // Lateral direita
        this.ctx.moveTo(width+x, height+y);
        this.ctx.lineTo(x+width/2, y);
        // Lateral esquerda
        this.ctx.lineTo(x, height+y);
    
		this.ctx.stroke();
		if(fill) this.ctx.fill();
		
		// Segundo triângulo
		this.ctx.beginPath();
		// Base do segundo triângulo
        this.ctx.moveTo(0.8*width+x, 3*height+y);
        this.ctx.lineTo(x+width*0.2, y+height*3);
		    // Lateral direita segundo triângulo
        this.ctx.moveTo(0.8*width+x, 3*height+y);
        this.ctx.lineTo(x+(width/2), y);
        // Lateral esquerda segundo triângulo
        this.ctx.lineTo(x+width*0.2, 3*height+y);
        
        this.ctx.stroke();
		if(fill) this.ctx.fill();
    
		this.ctx.restore();
	}

	/**
	 * Método que desenha a representação gráfica da peça
	 * @param {float} x Posição x da figura
	 * @param {float} y Posição y da figura
	 * @param {float} width Largura da figura
	 * @param {float} height Altura da figura
	 * @param {object} props Objeto que especifica as propriedades da figura
	 */
	repGrafica(x=5, y=5, width=10, height=20, props={}) {
		let linhas = typeof props.linhas == 'undefined' ? 1 : props.linhas;
		let dimensoes = typeof props.dimensoes == 'undefined' ? 1 : props.dimensoes;
		let descricao_fita = typeof props.descricao_fita == 'undefined' ? 1 : props.descricao_fita;
		let esp = typeof props.esp == 'undefined' ? 0.5 : this.scale(props.esp);
		let texto_campo = props.texto_campo;
		let font_size = parseFloat(props.font_size);
		let texto_dimensao = props.texto_dimensao;
		let info_text = this.ctx.measureText(texto_campo); 
		let width_text = (0.177*font_size)*texto_campo.length; // info_text.width*(font_size*0.041);  // (0.177*font_size)*texto_campo.length;
		let height_text = font_size*0.3;
		let font_size_dimensao = 8;  // Pequena
		let info_text_dimensao = this.ctx.measureText(texto_dimensao); 
		let width_text_dimensao = info_text_dimensao.width*(font_size_dimensao*0.037);
		let height_text_dimensao = font_size_dimensao*0.3;
		let ajuste_sup_y = 0.5;
		let ajuste_inf_y = 1;
		let ajuste_esq_x = 0.5;
		let ajuste_dir_x = 1;

		// Se o texto for maior que o tamanho do quadrado
		if(width_text > width) {
			let width_char = width_text/texto_campo.length;
			let dif = width_text-width;
			let width_dif = texto_campo.length-(dif/width_char).toFixed(0)-2;

			// Substituindo por 3 pontos no final
			texto_campo = texto_campo.substring(0, width_dif) + '...';
		}

		// Média
		if(width == 15) font_size_dimensao = 12;

		// Grande
		if(width == 30) font_size_dimensao = 20;

		width_text_dimensao = info_text_dimensao.width*(font_size_dimensao*0.037);
		height_text_dimensao = font_size_dimensao*0.3;

		// Mostrar linhas da fita
		if(linhas == 1) {
			// Margens
			this.line(x+0.2, y-2, width+x+esp, y-2);  // Margem superior
			this.line(x+0.2, y+height+2.8, width+x+esp, y+height+2.8);  // Margem inferior
			this.line(x-2, y+0.2, x-2, height+y+esp);  // Margem esquerda
			this.line(x+width+2.8, y+0.2, x+width+2.8, height+y+esp);  // Margem direita

			ajuste_sup_y = 3.3;
			ajuste_inf_y = 2.5;
			ajuste_esq_x = 3;
			ajuste_dir_x = 3.2;
		}

		// Mostrar descrição da fita
		if(descricao_fita != 7) {
			// Texto
			this.text(texto_campo, x, y-height_text-ajuste_sup_y, props);  // Texto superior
			this.text(texto_campo, x, y+height+ajuste_inf_y, props);  // Texto inferior
			this.text(texto_campo, x-height_text-ajuste_esq_x, y+height-height_text-0.5, {font_size: props.font_size, rotation: 270});  // Texto esquerda
			this.text(texto_campo, x+width+ajuste_dir_x, y-0.5, {font_size: props.font_size, rotation: 90});  // Texto direita
		}

		// Mostrar dimensões das peças
		if(dimensoes == 1) {
			this.text(texto_dimensao, x+1, y+height-height_text_dimensao-0.8, {font_size: font_size_dimensao});  // Texto dimensão largura
			this.text(texto_dimensao, x+width-height_text_dimensao-0.3, y+1, {rotation: 90, font_size: font_size_dimensao});  // Texto dimensão altura
		}

		// Quadrado representando a peça
		this.roundedRect(x, y, width, height, props);
	}

	/**
	 * Método que desenha uma imagem
	 * @param {ImageData} img 
	 * @param {float} x 
	 * @param {float} y 
	 * @param {float} width 
	 * @param {float} height 
	 * @param {integer} rotation 
	 */
	addImage(img, x=5, y=5, width=20, height=20, rotation=0) {
		let translate_x = 0;
		let translate_y = 0;

		x = this.scale(x);
		y = this.scale(y);
		width = this.scale(width);
		height = this.scale(height);
		translate_x = x + width/2;
		translate_y = y + height/2;

		this.ctx.save();
		this.ctx.translate(translate_x, translate_y);
		this.ctx.rotate(rotation * Math.PI / 180);
		this.ctx.translate(-translate_x, -translate_y);

		this.ctx.drawImage(img, x, y, width, height);
		this.ctx.restore();
	}

	/***** Caso seja necessário, adicione aqui os métodos novos *****/
	/** code... **/
	/***************************** Fim ******************************/

	/**
	 * Método que define a escala no qual será renderizado no canvas
	 * @param {float} mm 
	 * @returns
	 */
	scale(mm) {
		return mm * this.scl;
	}

	/**
	 * Método que imprime o conteúdo do canvas
	 * @param {string} title - Define o título da página de impressão
	 */
	print(title='') {
		let canvas = this.canvas.toDataURL('image/png');
		let windowContent = '<!DOCTYPE html>';
		let printWin = window.open('', '', width = 340, height = 260);

		windowContent += `<head><title>${title}</title></head>`;
		windowContent += '<body>';
		windowContent += `<img src="${canvas}"/>`;
		windowContent += '</body>';
		windowContent += '</html>';

		printWin.document.open();
		printWin.document.write(windowContent);
		printWin.document.close();
		printWin.focus();

		setTimeout(() => {printWin.print()}, 100)
	}

	/**
	 * Método que limpa a área do canvas
	 */
	clear() {
  		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  	}
}