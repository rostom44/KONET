import { FaSpinner } from "react-icons/fa";

function Loading() {
  return (
    <div className="loading">
      <FaSpinner className="spinner" />
      <p>Chargement en cours...</p>
    </div>
  );
}

export default Loading;
