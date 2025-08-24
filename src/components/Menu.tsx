import { useRef, useEffect, useState } from "react";
import { DEFAULT_SYSTEM_PROMPT } from "../types/chat";
import Spinner from "./Spinner";

type MenuProps = {
  onClearHistory: () => void;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
};

export default function Menu({
  onClearHistory,
  systemPrompt,
  setSystemPrompt,
}: MenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditPrompt, setShowEditPrompt] = useState(false);
  const [newPrompt, setNewPrompt] = useState(systemPrompt);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showUploadError, setShowUploadError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [showFileManager, setShowFileManager] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const fetchFileList = async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch(`${API_URL}/docs`);
      const data = await res.json();

      if (Array.isArray(data.docs)) {
        setFileList(data.docs);
      } else {
        console.error("Unexpected response format:", data);
        setFileList([]);
      }
    } catch (err) {
      console.error("Failed to fetch file list:", err);
      setFileList([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  const deleteFile = async (filename: string) => {
    setDeletingFile(filename);
    try {
      const res = await fetch(`${API_URL}/docs/${filename}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete file");

      setFileList((prev) => prev.filter((f) => f !== filename));
      setShowDeleteSuccess(true);
    } catch (err: any) {
      console.error("Delete error:", err);
      setDeleteErrorMessage(err.message || "Error deleting file.");
      setShowDeleteError(true);
    } finally {
      setDeletingFile(null);
    }
  };

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When the system prompt changes, update the prompt in the popup
  useEffect(() => {
    setNewPrompt(systemPrompt);
  }, [systemPrompt]);

  return (
    <div className="menu-container" ref={menuRef}>
      <button className="menu-button" onClick={() => setMenuOpen(prev => !prev)}>
        ☰
      </button>

      {menuOpen && (
        <nav className="menu-dropdown" role="menu" aria-label="Main menu">
          <div className="menu-items-container">
            <ul>
              <li
                tabIndex={0}
                role="menuitem"
                onClick={() => {
                  setShowConfirm(true);
                  setMenuOpen(false);
                }}
              >
                🧹 Clean chat history
              </li>
              <li
                tabIndex={0}
                role="menuitem"
                onClick={() => {
                  setShowEditPrompt(true);
                  setMenuOpen(false);
                }}
              >
                ✏️ Edit system prompt
              </li>
              <li
                tabIndex={0}
                role="menuitem"
                onClick={() => {
                  setShowUpload(true);
                  setMenuOpen(false);
                }}
              >
                📄 Upload PDF to RAG
              </li>
              <li
                tabIndex={0}
                role="menuitem"
                onClick={() => {
                  setShowFileManager(true);
                  setMenuOpen(false);
                  fetchFileList();
                }}
              >
                🗂️ Manage RAG files
              </li>
            </ul>
          </div>
        </nav>
      )}

      {showConfirm && (
        <div className="popup-backdrop">
          <div className="popup">
            <p>
              <strong>
                Are you sure you want to clear the chat history? This action cannot be undone
              </strong>
            </p>
            <div className="popup-buttons">
              <button
                className="confirm-button"
                onClick={() => {
                  onClearHistory();
                  setShowConfirm(false);
                }}
              >
                Yes
              </button>
              <button className="cancel-button" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditPrompt && (
        <div className="popup-backdrop">
          <div className="popup">
            <p><strong>Edit the system prompt:</strong></p>
            <textarea
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              rows={5}
            />
            <div className="popup-buttons">
              <button
                className="confirm-button"
                onClick={() => {
                  // Use default prompt if user provides an empty text
                  setSystemPrompt(newPrompt.trim() || DEFAULT_SYSTEM_PROMPT);
                  setShowEditPrompt(false);
                }}
              >
                Save
              </button>
              <button className="cancel-button" onClick={() => setShowEditPrompt(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpload && (
        <div className="popup-backdrop">
          <div className="popup">
            <p><strong>Upload PDF file to the RAG system:</strong></p>
            <div className="file-upload-section">
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                }}
              />
              <label htmlFor="pdf-upload" className="custom-file-upload">
                📄 Select PDF file
              </label>
            </div>

            {selectedFile && (
              <p>
                Selected file: {selectedFile.name}
              </p>
            )}

            <div className="popup-buttons">
              <button
                className="confirm-button"
                disabled={!selectedFile || uploading}
                onClick={async () => {
                  if (!selectedFile) return;

                  const formData = new FormData();
                  formData.append("file", selectedFile);
                  setUploading(true);

                  try {
                    const response = await fetch(`${API_URL}/docs`, {
                      method: "PUT",
                      body: formData,
                    });

                    if (!response.ok) {
                      const err = await response.json();
                      throw new Error(err.detail || "Upload failed");
                    }

                    setShowUpload(false);
                    setSelectedFile(null);
                    setShowUploadSuccess(true);
                  } catch (error: any) {
                    console.error("Upload failed:", error);
                    setUploadErrorMessage(error.message || "Unexpected error during upload");
                    setShowUploadError(true);
                  } finally {
                    setUploading(false);
                  }
                }}
              >
                {uploading ? (
                  <>
                    <Spinner /> Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>

              <button
                className="cancel-button"
                disabled={uploading}
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadSuccess && (
        <div className="popup-backdrop">
          <div className="popup">
            <p><strong>✅ PDF uploaded and vectorized successfully</strong></p>
            <div className="popup-buttons">
              <button
                className="confirm-button"
                onClick={() => setShowUploadSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadError && (
        <div className="popup-backdrop">
          <div className="popup">
            <p><strong>❌ Upload failed</strong></p>
            <p>
              {uploadErrorMessage}
            </p>
            <div className="popup-buttons">
              <button
                className="confirm-button"
                onClick={() => setShowUploadError(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showFileManager && !showDeleteSuccess && !showDeleteError && (
        <div className="popup-backdrop">
          <div className="popup">
            <h3>Uploaded files in RAG system</h3>

            {loadingFiles ? (
              <>
                <Spinner />
                <br /><br />
              </>
            ) : fileList.length === 0 ? (
              <p>No files uploaded</p>
            ) : (
              <>
                <ul className="file-list">
                  {fileList.map((filename) => (
                    <li key={filename} className="file-item">
                      <a
                        href={`${API_URL}/docs/${encodeURIComponent(filename)}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {filename}
                      </a>
                      <button
                        className="delete-button"
                        onClick={() => {
                          setFileToDelete(filename);
                          setShowDeleteConfirm(true);
                        }}
                        disabled={deletingFile === filename}
                      >
                        {deletingFile === filename ? (
                          <>
                            <Spinner />
                            <br /><br />
                          </>
                        ) : (
                          "❌"
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
                <br/>
              </>
            )}

            <div className="popup-buttons">
              <button
                className="cancel-button"
                onClick={() => setShowFileManager(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && fileToDelete && (
        <div className="popup-backdrop">
          <div className="popup">
            <p>
              <strong>
                Are you sure you want to delete the selected file from the RAG system? This action cannot be undone
              </strong>
            </p>
            {fileToDelete && (
              <p>
                Selected file: {fileToDelete}
              </p>
            )}
            <div className="popup-buttons">
              <button
                className="confirm-button"
                onClick={() => {
                  deleteFile(fileToDelete);
                  setShowDeleteConfirm(false);
                  setFileToDelete(null);
                }}
              >
                Yes
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setFileToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteSuccess && (
        <div className="popup-backdrop">
          <div className="popup">
            <p><strong>✅ File deleted successfully</strong></p>
            <div className="popup-buttons">
              <button
                className="confirm-button"
                onClick={() => setShowDeleteSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteError && (
        <div className="popup-backdrop">
          <div className="popup">
            <p><strong>❌ Failed to delete file</strong></p>
            <p>{deleteErrorMessage}</p>
            <div className="popup-buttons">
              <button
                className="confirm-button"
                onClick={() => setShowDeleteError(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
