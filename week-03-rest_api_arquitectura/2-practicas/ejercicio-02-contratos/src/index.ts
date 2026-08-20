import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

// 25 productos de ejemplo, para poder ver paginación real
const productos: Producto[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  nombre: `Producto ${i + 1}`,
  precio: (i + 1) * 1000
}));

// Tipos del contrato de respuesta
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

// GET /productos?page=1&pageSize=10 -> lista paginada
app.get("/productos", (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.max(1, Number(req.query.pageSize) || 10);

  const totalPages = Math.ceil(productos.length / pageSize);
  const inicio = (page - 1) * pageSize;
  const fin = inicio + pageSize;
  const pagina = productos.slice(inicio, fin);

  const respuesta: ApiSuccessResponse<Producto[]> = {
    success: true,
    data: pagina,
    meta: {
      total: productos.length,
      page,
      pageSize,
      totalPages
    }
  };

  res.status(200).json(respuesta);
});

// GET /productos/:id -> obtiene uno, o error 404 con contrato consistente
app.get("/productos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    const respuestaError: ApiErrorResponse = {
      success: false,
      error: {
        message: `Producto con id ${id} no encontrado`,
        code: "NOT_FOUND"
      }
    };
    return res.status(404).json(respuestaError);
  }

  const respuesta: ApiSuccessResponse<Producto> = {
    success: true,
    data: producto
  };

  res.status(200).json(respuesta);
});

// Middleware de 404 genérico con el mismo contrato
app.use((req: Request, res: Response) => {
  const respuestaError: ApiErrorResponse = {
    success: false,
    error: {
      message: "Ruta no encontrada",
      code: "ROUTE_NOT_FOUND"
    }
  };
  res.status(404).json(respuestaError);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Ejercicio 02 (contratos) corriendo en http://localhost:${PORT}`);
});