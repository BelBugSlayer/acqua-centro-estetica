import fs from 'node:fs/promises';
import {
  Presentation,
  PresentationFile
} from 'file:///C:/Users/marib/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const root = 'C:/Users/marib/Documents/Acqua';
const outDir = `${root}/outputs`;
const logoPath = `${root}/frontend/public/assets/acqua-logo.jpeg`;

const colors = {
  ink: '#203335',
  muted: '#667B7D',
  aqua: '#8BC7C1',
  aquaDark: '#0B4B4A',
  pearl: '#F6FBFA',
  line: '#D7E8E5',
  gold: '#C4A76C',
  white: '#FFFFFF'
};

await fs.mkdir(outDir, { recursive: true });
for (const file of await fs.readdir(outDir)) {
  if (file.startsWith('presentacion-slide-') || file === 'presentacion-montage.webp') {
    await fs.rm(`${outDir}/${file}`, { force: true });
  }
}

const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });

function text(slide, value, position, style = {}) {
  const box = slide.shapes.add({
    geometry: 'textbox',
    position,
    fill: 'none',
    line: { style: 'solid', fill: 'none', width: 0 }
  });
  box.text = value;
  box.text.style = {
    typeface: 'Aptos',
    fontSize: 22,
    color: colors.ink,
    ...style
  };
  return box;
}

async function titleSlide() {
  const slide = presentation.slides.add();
  slide.background.fill = colors.pearl;
  text(slide, 'Proyecto final Base de Datos II', { left: 70, top: 82, width: 720, height: 150 }, {
    typeface: 'Georgia',
    fontSize: 50,
    bold: true
  });
  text(slide, 'Sistema web de turnos y ventas para Acqua Centro de Estetica', { left: 72, top: 255, width: 700, height: 70 }, {
    fontSize: 25,
    color: colors.muted
  });
  text(slide, 'Integrantes: Gonzalez Loto María Belén y Herrera Mariela Verónica', { left: 72, top: 350, width: 790, height: 44 }, {
    fontSize: 23,
    bold: true,
    color: colors.aquaDark
  });
  slide.shapes.add({
    geometry: 'roundRect',
    position: { left: 865, top: 92, width: 300, height: 300 },
    fill: colors.white,
    line: { style: 'solid', fill: colors.line, width: 1 },
    borderRadius: 'rounded-md'
  });
  try {
    const bytes = await fs.readFile(logoPath);
    slide.images.add({
      blob: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      contentType: 'image/jpeg',
      alt: 'Logo Acqua Centro de Estetica',
      fit: 'cover',
      position: { left: 895, top: 122, width: 240, height: 240 },
      geometry: 'ellipse'
    });
  } catch {
    text(slide, 'ACQUA', { left: 930, top: 220, width: 180, height: 50 }, { typeface: 'Georgia', fontSize: 34 });
  }
  footer(slide, 1);
}

function normalSlide(kicker, heading, body) {
  const slide = presentation.slides.add();
  slide.background.fill = colors.pearl;
  text(slide, kicker, { left: 70, top: 58, width: 620, height: 30 }, {
    fontSize: 13,
    bold: true,
    color: colors.aquaDark
  });
  text(slide, heading, { left: 70, top: 115, width: 940, height: 86 }, {
    typeface: 'Georgia',
    fontSize: 46,
    bold: true
  });
  if (body) {
    text(slide, body, { left: 72, top: 224, width: 860, height: 76 }, {
      fontSize: 22,
      color: colors.muted
    });
  }
  footer(slide, presentation.slides.items.length);
  return slide;
}

function bulletList(slide, items, left = 90, top = 340, width = 900) {
  items.forEach((item, index) => {
    const y = top + index * 58;
    slide.shapes.add({
      geometry: 'ellipse',
      position: { left, top: y + 8, width: 14, height: 14 },
      fill: index % 2 === 0 ? colors.aquaDark : colors.gold,
      line: { style: 'solid', fill: 'none', width: 0 }
    });
    text(slide, item, { left: left + 28, top: y, width, height: 46 }, {
      fontSize: 21
    });
  });
}

function card(slide, left, top, width, height, heading, body) {
  slide.shapes.add({
    geometry: 'roundRect',
    position: { left, top, width, height },
    fill: colors.white,
    line: { style: 'solid', fill: colors.line, width: 1 },
    borderRadius: 'rounded-md'
  });
  slide.shapes.add({
    geometry: 'rect',
    position: { left, top, width: 8, height },
    fill: colors.aqua,
    line: { style: 'solid', fill: colors.aqua, width: 0 }
  });
  text(slide, heading, { left: left + 24, top: top + 22, width: width - 42, height: 30 }, {
    fontSize: 21,
    bold: true
  });
  text(slide, body, { left: left + 24, top: top + 62, width: width - 48, height: height - 76 }, {
    fontSize: 17,
    color: colors.muted
  });
}

function footer(slide, number) {
  text(slide, 'Acqua Centro de Estetica | Base de Datos II', { left: 70, top: 674, width: 520, height: 22 }, {
    fontSize: 11,
    color: colors.muted
  });
  text(slide, String(number).padStart(2, '0'), { left: 1160, top: 670, width: 50, height: 28 }, {
    fontSize: 14,
    bold: true,
    color: colors.aquaDark
  });
}

await titleSlide();

let slide = normalSlide('PROBLEMA A RESOLVER', 'Gestion dispersa de turnos y ventas', 'Una estetica puede recibir consultas por redes sociales, registrar turnos manualmente y vender productos sin control claro de stock.');
card(slide, 80, 360, 330, 140, 'Turnos', 'Riesgo de anotar mal fecha, horario o servicio.');
card(slide, 470, 360, 330, 140, 'Productos', 'Dificultad para saber stock y ventas realizadas.');
card(slide, 860, 360, 330, 140, 'Datos', 'La informacion queda separada y no siempre se puede consultar.');

slide = normalSlide('SOLUCION PROPUESTA', 'Aplicacion web simple', 'El cliente puede ver servicios, pedir turnos, comprar productos y elegir forma de pago. La informacion se guarda en MongoDB.');
bulletList(slide, ['Frontend en React para navegar la pagina.', 'Backend en Express para recibir turnos y compras.', 'MongoDB para guardar servicios, productos, turnos y pedidos.', 'MongoDB Compass para mostrar visualmente la base de datos.']);

slide = normalSlide('BASE DE DATOS', 'Modelo NoSQL en MongoDB', 'Usamos colecciones simples, faciles de explicar y conectadas con el uso real de la pagina.');
card(slide, 80, 340, 250, 130, 'services', 'Servicios con precio, duracion, categoria e imagen.');
card(slide, 360, 340, 250, 130, 'products', 'Productos con precio, categoria, stock e imagen.');
card(slide, 640, 340, 250, 130, 'appointments', 'Turnos con datos del cliente, servicio, fecha, hora y pago.');
card(slide, 920, 340, 250, 130, 'orders', 'Compras con cliente, productos, total y metodo de pago.');

slide = normalSlide('IMPLEMENTACION', 'Que construimos', 'El proyecto tiene frontend, backend, conexion a MongoDB, datos iniciales e imagenes reales de Acqua.');
bulletList(slide, ['Pantallas separadas: Inicio, Servicios, Productos, Turnos y Carrito.', 'Registro de turnos en appointments.', 'Registro de compras en orders.', 'Descuento de stock en products al comprar.', 'Boton de Mercado Pago como enlace demostrativo.']);

slide = normalSlide('PUBLICACION', 'Como se puede publicar', 'Para la entrega se deja preparado Docker y una guia para publicar el frontend en Vercel.');
bulletList(slide, ['Docker Compose levanta MongoDB, backend y frontend juntos.', 'GitHub o GitLab sirve para subir el repositorio.', 'Vercel publica el frontend.', 'El backend puede publicarse en Render o Railway.', 'MongoDB Atlas permite tener la base en la nube.']);

slide = normalSlide('APRENDIZAJES', 'Dificultades y soluciones', 'Durante el desarrollo aparecieron problemas reales de configuracion, conexion y organizacion del proyecto.');
bulletList(slide, ['Aprendimos a instalar Node.js, MongoDB, MongoDB Compass y Docker.', 'Separamos frontend y backend para entender mejor responsabilidades.', 'Usamos .env para no dejar la conexion fija en el codigo.', 'Simplificamos la demo mostrando la base desde Compass.', 'Docker ayuda a ejecutar todo junto sin abrir backend y frontend por separado.']);

slide = normalSlide('DEMO', 'Que mostrar en la defensa', 'La defensa puede ser breve: abrir la web, crear un turno, comprar un producto y verificar los documentos en MongoDB Compass.');
bulletList(slide, ['Abrir la pagina web.', 'Mostrar servicios y productos con imagenes.', 'Solicitar un turno.', 'Registrar una compra.', 'Abrir MongoDB Compass y mostrar appointments, orders y products.']);

for (const [index, item] of presentation.slides.items.entries()) {
  const png = await presentation.export({ slide: item, format: 'png', scale: 1 });
  await fs.writeFile(`${outDir}/presentacion-slide-${String(index + 1).padStart(2, '0')}.png`, new Uint8Array(await png.arrayBuffer()));
}

const montage = await presentation.export({ format: 'webp', montage: true, scale: 1 });
await fs.writeFile(`${outDir}/presentacion-montage.webp`, new Uint8Array(await montage.arrayBuffer()));

const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(`${outDir}/presentacion-acqua-centro-estetica.pptx`);

console.log(`${outDir}/presentacion-acqua-centro-estetica.pptx`);
