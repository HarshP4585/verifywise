import { Evidence } from "../models/Evidence";
import pool from "../database/db";

export const getAllEvidencesQuery = async (): Promise<Evidence[]> => {
  console.log("getAllEvidences");
  const evidences = await pool.query("SELECT * FROM evidences");
  return evidences.rows;
};

export const getEvidenceByIdQuery = async (id: number): Promise<Evidence | null> => {
  console.log("getEvidenceById", id);
  const result = await pool.query("SELECT * FROM evidences WHERE id = $1", [id]);
  return result.rows.length ? result.rows[0] : null;
};

export const createNewEvidenceQuery = async (evidence: {
  subrequirement_id: number
  document_name: string
  document_type: string
  file_path: string
  upload_date: string
  uploader_id: number
  description: string
  status: string
  last_reviewed: string
  reviewer_id: number
  review_comments: string
}): Promise<Evidence> => {
  console.log("createNewEvidence", evidence);
  const result = await pool.query(
    "INSERT INTO evidences (subrequirement_id, document_name, document_type, file_path, upload_date, uploader_id, description, status, last_reviewed, reviewer_id, review_comments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
    [evidence.subrequirement_id, evidence.document_name, evidence.document_type, evidence.file_path, evidence.upload_date, evidence.uploader_id, evidence.description, evidence.status, evidence.last_reviewed, evidence.reviewer_id, evidence.review_comments]
  );
  return result.rows[0];
};

export const updateEvidenceByIdQuery = async (
  id: number,
  evidence: {
    subrequirement_id?: number
    document_name?: string
    document_type?: string
    file_path?: string
    upload_date?: string
    uploader_id?: number
    description?: string
    status?: string
    last_reviewed?: string
    reviewer_id?: number
    review_comments?: string
  }
): Promise<Evidence | null> => {
  console.log("updateEvidenceById", id, evidence);
  const fields = [];
  const values = [];
  let query = "UPDATE evidences SET ";

  if(evidence.subrequirement_id) {
    fields.push("subrequirement_id = $1");
    values.push(evidence.subrequirement_id)
  }
  if(evidence.document_name) {
    fields.push("document_name = $2");
    values.push(evidence.document_name)
  }
  if(evidence.document_type) {
    fields.push("document_type = $3");
    values.push(evidence.document_type)
  }
  if(evidence.file_path) {
    fields.push("file_path = $4");
    values.push(evidence.file_path)
  }
  if(evidence.upload_date) {
    fields.push("upload_date = $5");
    values.push(evidence.upload_date)
  }
  if(evidence.uploader_id) {
    fields.push("uploader_id = $6");
    values.push(evidence.uploader_id)
  }
  if(evidence.description) {
    fields.push("description = $7");
    values.push(evidence.description)
  }
  if(evidence.status) {
    fields.push("status = $8");
    values.push(evidence.status)
  }
  if(evidence.last_reviewed) {
    fields.push("last_reviewed = $9");
    values.push(evidence.last_reviewed)
  }
  if(evidence.reviewer_id) {
    fields.push("reviewer_id = $10");
    values.push(evidence.reviewer_id)
  }
  if(evidence.review_comments) {
    fields.push("review_comments = $11");
    values.push(evidence.review_comments)
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  query += fields.join(", ") + " WHERE id = $12 RETURNING *";
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows.length ? result.rows[0] : null;
};

export const deleteEvidenceByIdQuery = async (id: number): Promise<boolean> => {
  console.log("deleteEvidenceById", id);
  const result = await pool.query(
    "DELETE FROM evidences WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rowCount !== null && result.rowCount > 0;
};
