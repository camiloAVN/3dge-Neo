import bcryptjs from 'bcryptjs';

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

interface SeedCategory {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

interface SeedProduct {
  title: string;
  description: string;
  inStock: number;
  price: number;
  slug: string;
  tags: string[];
  images: string[];
  categorySlug: string;
}

interface SeedData {
  users: SeedUser[];
  categories: SeedCategory[];
  products: SeedProduct[];
}

export const initialData: SeedData = {

  /* ── USERS ── */
  users: [
    {
      email: 'camilo@3dge.co',
      name: 'Camilo Vargas',
      password: bcryptjs.hashSync('123456'),
      role: 'admin',
    },
    {
      email: 'cliente@3dge.co',
      name: 'Cliente Demo',
      password: bcryptjs.hashSync('123456'),
      role: 'user',
    },
  ],

  /* ── CATEGORIES ── */
  categories: [
    {
      name: 'NEO',
      slug: 'neo',
      description: 'Organizadores de pared de línea recta con estética neoplasticista. Composiciones geométricas en rojo, azul y amarillo.',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'HEXA',
      slug: 'hexa',
      description: 'Módulos hexagonales apilables para organizar llaves, accesorios y objetos cotidianos.',
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'CREA',
      slug: 'crea',
      description: 'Próximamente — Kits de creación y personalización para armar tu propio organizador 3DGE.',
      isActive: true,
      sortOrder: 3,
    },
  ],

  /* ── PRODUCTS ── */
  products: [

    /* ══ NEO ══ */
    {
      title: 'Panel NEO · Llavero',
      description: 'Panel de pared de madera lacada en rojo y azul. Cuatro ganchos de acero pintado en negro para llaves y accesorios pequeños. Líneas rectas, composición fija. Incluye anclaje a pared.',
      inStock: 12,
      price: 95000,
      slug: 'panel-neo-llavero',
      tags: ['llavero', 'neo', 'pared', 'madera'],
      images: ['neo/neo_1.jpg', 'neo/neo_2.jpg'],
      categorySlug: 'neo',
    },
    {
      title: 'Panel NEO · Perchero',
      description: 'Perchero mural de doble cuerpo en negro y amarillo. Dos brazos abatibles en acero para abrigos y chaquetas. Ancho 60 cm, profundidad 12 cm. Anclaje resistente incluido.',
      inStock: 8,
      price: 185000,
      slug: 'panel-neo-perchero',
      tags: ['perchero', 'neo', 'chaquetas', 'abrigos'],
      images: ['neo/neo_2.jpg', 'neo/neo_3.jpg'],
      categorySlug: 'neo',
    },
    {
      title: 'Módulo NEO · Alto',
      description: 'Módulo vertical de 80 cm en azul primario con franja roja. Seis ganchos distribuidos en composición asimétrica. Ideal para pasillos y entradas. Montaje en dos puntos.',
      inStock: 6,
      price: 235000,
      slug: 'modulo-neo-alto',
      tags: ['módulo', 'neo', 'vertical', 'pasillo'],
      images: ['neo/neo_3.jpg', 'neo/neo_1.jpg'],
      categorySlug: 'neo',
    },
    {
      title: 'Panel NEO · Doble',
      description: 'Composición de dos paneles superpuestos en rojo y negro. Ocho puntos de colgado entre ambos cuerpos. Perfecto para recibidores de uso intensivo. Madera contrachapada lacada en frío.',
      inStock: 4,
      price: 310000,
      slug: 'panel-neo-doble',
      tags: ['doble', 'neo', 'recibidor', 'alta capacidad'],
      images: ['neo/neo_1.jpg', 'neo/neo_3.jpg'],
      categorySlug: 'neo',
    },
    {
      title: 'Panel NEO · Compacto',
      description: 'Versión reducida del Panel NEO, 30 × 20 cm. Tres ganchos en amarillo sobre fondo negro. Para espacios pequeños o zonas de paso. Instalación con dos tornillos ocultos.',
      inStock: 20,
      price: 72000,
      slug: 'panel-neo-compacto',
      tags: ['compacto', 'neo', 'pequeño', 'espacio reducido'],
      images: ['neo/neo_2.jpg', 'neo/neo_1.jpg'],
      categorySlug: 'neo',
    },
    {
      title: 'Kit NEO · Starter',
      description: 'Kit de inicio: Panel NEO Llavero + Panel NEO Compacto + 8 ganchos adicionales. La mejor forma de comenzar tu composición 3DGE en casa. Packaging caja negra.',
      inStock: 10,
      price: 149000,
      slug: 'kit-neo-starter',
      tags: ['kit', 'neo', 'combo', 'starter'],
      images: ['neo/neo_3.jpg', 'neo/neo_2.jpg'],
      categorySlug: 'neo',
    },
    {
      title: 'Módulo NEO · Triple',
      description: 'Tres módulos verticales de distinta altura formando una composición escalonada. Colores rojo, azul y amarillo puros. 100 cm de ancho total, listo para ensamblar. Manual de instalación incluido.',
      inStock: 3,
      price: 395000,
      slug: 'modulo-neo-triple',
      tags: ['triple', 'neo', 'composición', 'escalera'],
      images: ['neo/neo_1.jpg', 'neo/neo_2.jpg'],
      categorySlug: 'neo',
    },
    {
      title: 'Panel NEO · Esquina',
      description: 'Panel diseñado para esquinas en ángulo de 90°. Aprovecha el rincón del recibidor con ganchos laterales en cada cara. Negro y rojo. Único en el catálogo 3DGE.',
      inStock: 0,
      price: 260000,
      slug: 'panel-neo-esquina',
      tags: ['esquina', 'neo', 'rincón', 'angular'],
      images: ['neo/neo_3.jpg', 'neo/neo_1.jpg'],
      categorySlug: 'neo',
    },

    /* ══ HEXA ══ */
    {
      title: 'Módulo HEXA · Base',
      description: 'Módulo hexagonal de 22 cm de lado en madera lacada amarilla. Tres ganchos internos y un plano de apoyo. Montaje individual o apilable con otros módulos HEXA.',
      inStock: 18,
      price: 88000,
      slug: 'modulo-hexa-base',
      tags: ['hexa', 'hexágono', 'modular', 'amarillo'],
      images: ['hexa/hexa_1.jpg', 'hexa/hexa_2.jpg'],
      categorySlug: 'hexa',
    },
    {
      title: 'Módulo HEXA · Doble',
      description: 'Dos módulos hexagonales ensamblados en vertical. Lacado en azul y negro. Seis ganchos en total para distribución flexible de llaves y accesorios. Kit de unión incluido.',
      inStock: 9,
      price: 162000,
      slug: 'modulo-hexa-doble',
      tags: ['hexa', 'doble', 'azul', 'negro'],
      images: ['hexa/hexa_2.jpg', 'hexa/hexa_1.jpg'],
      categorySlug: 'hexa',
    },
    {
      title: 'Panel HEXA · Perchero',
      description: 'Módulo hexagonal XL de 35 cm de lado con brazo abatible integrado. Lacado en rojo. Soporta hasta 8 kg. Ideal para una chaqueta y accesorios adicionales.',
      inStock: 5,
      price: 215000,
      slug: 'panel-hexa-perchero',
      tags: ['hexa', 'perchero', 'rojo', 'brazo abatible'],
      images: ['hexa/hexa_1.jpg', 'hexa/hexa_2.jpg'],
      categorySlug: 'hexa',
    },
    {
      title: 'Módulo HEXA · Premium',
      description: 'Edición premium del HEXA Base en madera de pino macizo sin lacado, acabado natural encerado. Ganchos en cobre. Composición minimalista para espacios de diseño.',
      inStock: 7,
      price: 135000,
      slug: 'modulo-hexa-premium',
      tags: ['hexa', 'premium', 'natural', 'cobre'],
      images: ['hexa/hexa_2.jpg', 'hexa/hexa_1.jpg'],
      categorySlug: 'hexa',
    },
    {
      title: 'Kit HEXA · Colmena',
      description: 'Siete módulos HEXA Base en distribución de colmena. Tres colores del espectro 3DGE (rojo, azul, amarillo). La composición definitiva para paredes grandes. Instrucciones de instalación paso a paso.',
      inStock: 2,
      price: 490000,
      slug: 'kit-hexa-colmena',
      tags: ['hexa', 'kit', 'colmena', 'composición grande'],
      images: ['hexa/hexa_1.jpg', 'hexa/hexa_2.jpg'],
      categorySlug: 'hexa',
    },
  ],
};
