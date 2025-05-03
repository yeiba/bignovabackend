/**
 * Repository interface for database operations
 * This interface defines the contract that any repository implementation must follow
 */
export interface IRepository {
  /**
   * Create a new document
   * @param model - Database model
   * @param data - Data to be saved
   */
  createDocument(
    model: any,
    data: any
  ): Promise<Record<string, any> | undefined>;

  /**
   * Find a document by its ID
   * @param model - Database model
   * @param id - Document ID
   */
  findById(model: any, id: string): Promise<Record<string, any> | undefined>;

  /**
   * Find a document by a field value
   * @param model - Database model
   * @param fieldValue - Field value to search for
   */
  findOne(
    model: any,
    fieldName: string,
    fieldValue: any
  ): Promise<Record<string, any> | undefined>;
  /**
   * Find a document by a field value
   * @param model - Database model
   * @param page - Field value to search for
   * @param limit - Field value to search for
   */
  find(
    model: any,
    page?: number,
    limit?: number
  ): Promise<Record<string, any> | undefined>;

  /**
   * Update a document by its ID
   * @param model - Database model
   * @param id - Document ID
   * @param data - Updated data
   */
  updateById(
    model: any,
    id: string,
    data: any
  ): Promise<Record<string, any> | undefined>;

  /**
   * Delete a document by its ID
   * @param model - Database model
   * @param id - Document ID
   */
  deleteById(model: any, id: string): Promise<Record<string, any> | undefined>;
}
