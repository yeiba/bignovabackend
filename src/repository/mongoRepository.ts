import { PrismaClient } from "@prisma/client";
import { IRepository } from "./repository.interface";

const prisma = new PrismaClient();

export class MongodbRepository implements IRepository {
  public async createDocument(
    model: any,
    data: any
  ): Promise<Record<string, any> | undefined> {
    try {
      const document = await model.create({ data });
      return document ?? undefined;
    } catch (error: any) {
      throw new Error("Failed to create document: " + error.message);
    }
  }

  public async findById(
    model: any,
    id: string
  ): Promise<Record<string, any> | undefined> {
    try {
      const document = await model.findUnique({
        where: { id: id },
      });
      return document ?? undefined;
    } catch (error: any) {
      throw new Error("Failed to find document: " + error.message);
    }
  }

  public async findOne(
    model: any,
    fieldName: string,
    fieldValue: any
  ): Promise<Record<string, any> | undefined> {
    try {
      const whereClause = { [fieldName]: fieldValue };
      const document = await model.findFirst({
        where: whereClause,
      });
      return document ?? undefined;
    } catch (error: any) {
      throw new Error("Failed to find document: " + error.message);
    }
  }

  public async find(
    model: any,
    page?: number,
    limit?: number
  ): Promise<Record<string, any>[] | undefined> {
    try {
      if (page && limit) {
        const skip = (page - 1) * limit;
        const documents = await model.findMany({
          skip,
          take: limit,
        });
        return documents ?? undefined;
      } else {
        const documents = await model.findMany();
        return documents ?? undefined;
      }
    } catch (error: any) {
      throw new Error("Failed to find all documents: " + error.message);
    }
  }

  public async updateById(
    model: any,
    id: string,
    data: any
  ): Promise<Record<string, any> | undefined> {
    try {
      const updatedDocument = await model.update({
        where: { id },
        data,
      });
      return updatedDocument ?? undefined;
    } catch (error: any) {
      throw new Error("Failed to update document: " + error.message);
    }
  }

  public async deleteById(
    model: any,
    id: string
  ): Promise<Record<string, any> | undefined> {
    try {
      const deletedDocument = await model.delete({
        where: { id },
      });
      return deletedDocument ?? undefined;
    } catch (error: any) {
      throw new Error("Failed to delete document: " + error.message);
    }
  }
}
