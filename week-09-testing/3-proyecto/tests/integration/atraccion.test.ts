import { Atraccion } from '../src/models/Atraccion';

describe("Atraccion Model - Integration Tests", () => {
  it("debe crear atracción correctamente", async () => {
    const atraccionData = {
      nombre: 'Montaña Rusa',
      descripcion: 'Atracción emocionante para todos',
      categoria: 'montana_rusa' as const,
      capacidad: 20,
      precio: 25,
      activa: true
    };

    const atraccion = new Atraccion(atraccionData);
    const guardada = await atraccion.save();

    expect(guardada).toBeDefined();
    expect(guardada._id).toBeDefined();
    expect(guardada.nombre).toBe(atraccionData.nombre);
    expect(guardada.categoria).toBe(atraccionData.categoria);
    expect(guardada.precio).toBe(atraccionData.precio);
  });

  it("debe rechazar atracción sin nombre", async () => {
    const atraccionData = {
      nombre: '',
      descripcion: 'Atracción emocionante',
      categoria: 'montana_rusa' as const,
      capacidad: 20,
      precio: 25
    };

    const atraccion = new Atraccion(atraccionData);
    
    await expect(atraccion.save()).rejects.toThrow();
  });

  it("debe rechazar atracción con capacidad negativa", async () => {
    const atraccionData = {
      nombre: 'Montaña Rusa',
      descripcion: 'Atracción emocionante',
      categoria: 'montana_rusa' as const,
      capacidad: -5,
      precio: 25
    };

    const atraccion = new Atraccion(atraccionData);
    
    await expect(atraccion.save()).rejects.toThrow();
  });

  it("debe buscar atracción por categoría", async () => {
    const atraccion1 = new Atraccion({
      nombre: 'Montaña Rusa 1',
      descripcion: 'Primera montaña rusa',
      categoria: 'montana_rusa' as const,
      capacidad: 20,
      precio: 25
    });

    const atraccion2 = new Atraccion({
      nombre: 'Acuario',
      descripcion: 'Acuario tropical',
      categoria: 'acuario' as const,
      capacidad: 50,
      precio: 15
    });

    await atraccion1.save();
    await atraccion2.save();

    const montañasRusas = await Atraccion.find({ categoria: 'montana_rusa' });
    
    expect(montañasRusas).toHaveLength(1);
    expect(montañasRusas[0].categoria).toBe('montana_rusa');
  });

  it("debe actualizar atracción correctamente", async () => {
    const atraccion = new Atraccion({
      nombre: 'Montaña Rusa',
      descripcion: 'Atracción inicial',
      categoria: 'montana_rusa' as const,
      capacidad: 20,
      precio: 25
    });
    
    await atraccion.save();
    
    atraccion.precio = 30;
    const actualizada = await atraccion.save();
    
    expect(actualizada.precio).toBe(30);
  });

  it("debe eliminar atracción correctamente", async () => {
    const atraccion = new Atraccion({
      nombre: 'Montaña Rusa',
      descripcion: 'Atracción a eliminar',
      categoria: 'montana_rusa' as const,
      capacidad: 20,
      precio: 25
    });
    
    await atraccion.save();
    
    const eliminada = await Atraccion.findByIdAndDelete(atraccion._id);
    
    expect(eliminada).toBeDefined();
    expect(eliminada._id).toEqual(atraccion._id);
  });
});
