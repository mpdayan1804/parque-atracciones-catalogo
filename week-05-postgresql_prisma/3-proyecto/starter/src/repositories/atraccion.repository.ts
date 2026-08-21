import { prisma } from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export const atraccionRepository = {
  async findAll(categoria?: string) {
    const where: Prisma.AtraccionWhereInput = categoria
      ? { categoria: categoria as Prisma.AtraccionWhereInput["categoria"] }
      : {};

    return prisma.atraccion.findMany({
      where,
      orderBy: { id: "asc" }
    });
  },

  async findById(id: number) {
    return prisma.atraccion.findUnique({ where: { id } });
  },

  async create(data: Prisma.AtraccionCreateInput) {
    return prisma.atraccion.create({ data });
  },

  async update(id: number, data: Prisma.AtraccionUpdateInput) {
    return prisma.atraccion.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.atraccion.delete({ where: { id } });
  },

  async count(categoria?: string) {
    const where: Prisma.AtraccionWhereInput = categoria
      ? { categoria: categoria as Prisma.AtraccionWhereInput["categoria"] }
      : {};

    return prisma.atraccion.count({ where });
  }
};