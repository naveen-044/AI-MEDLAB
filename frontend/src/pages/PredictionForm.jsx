import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCloudArrowUp, FaShieldHeart } from "react-icons/fa6";
import { toast } from "react-toastify";
import { BASE_URL } from "../config";
import { healthToolFields, healthTools } from "../data/healthTools";

const PredictionForm = () => {
  const { type } = useParams();
  const tool = healthTools.find((item) => item.id === type);
  const imageInputRef = useRef(null);
  const [values, setValues] = useState({});
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return undefined;
    }
    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  if (!tool) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Screening not found
        </h1>
        <Link
          to="/health-predict"
          className="mt-5 inline-flex rounded-full bg-cyan-700 px-5 py-3 font-bold text-white"
        >
          Browse health tools
        </Link>
      </section>
    );
  }

  const fields = healthToolFields[type] || [];
  const isImageTool = tool.type === "image";

  const handleImageChange = (event) => {
    const selectedImage = event.target.files?.[0] || null;
    setErrorMessage("");
    setResult("");
    if (
      selectedImage &&
      !["image/png", "image/jpeg", "image/webp"].includes(selectedImage.type)
    ) {
      setImage(null);
      event.target.value = "";
      setErrorMessage("Choose a supported image file.");
      return;
    }
    if (selectedImage && selectedImage.size > 10 * 1024 * 1024) {
      setImage(null);
      event.target.value = "";
      setErrorMessage("Choose an image smaller than 10 MB.");
      return;
    }
    setImage(selectedImage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setResult("");

    try {
      const endpoint = isImageTool
        ? `${BASE_URL}/predict-${type}`
        : `${BASE_URL}/${type}`;
      let response;

      if (isImageTool) {
        if (!image) {
          setErrorMessage("Choose an image before starting the screening.");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("image", image);
        response = await fetch(endpoint, { method: "POST", body: formData });
      } else {
        const data = Object.fromEntries(
          fields.map(({ name }) => {
            const val = Number(values[name]);
            return [name, Number.isFinite(val) ? val : 0];
          }),
        );
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
      }

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          responseBody.message || "The screening request could not be completed.",
        );
      }

      const prediction = responseBody.prediction ?? responseBody.data;
      if (prediction === undefined || prediction === null || prediction === "") {
        throw new Error("The screening service returned no result.");
      }
      setResult(
        typeof prediction === "string"
          ? prediction.trim()
          : JSON.stringify(prediction, null, 2),
      );
      toast.success("Screening complete. Please review the information below.");
    } catch (error) {
      setErrorMessage(
        error.message || "The screening service is unavailable. Try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  const Icon = tool.icon;

  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        to="/health-predict"
        className="inline-flex items-center gap-2 text-sm font-bold text-cyan-800 hover:text-cyan-950"
      >
        <FaArrowLeft aria-hidden="true" />
        All health tools
      </Link>

      <div className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
        <div className="border-b border-slate-100 bg-gradient-to-r from-cyan-50 via-white to-amber-50 px-6 py-8 sm:px-10">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${tool.tone}`}
            >
              <Icon aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-800">
                AI-assisted screening
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {tool.title}
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl leading-6 text-slate-600">
            {tool.description} Enter information as provided by your healthcare
            professional. This tool does not establish a medical diagnosis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10">
          {isImageTool ? (
            <div>
              <label
                htmlFor="screening-image"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                {type === "malaria"
                  ? "Blood-cell image"
                  : "Chest X-ray image"}
              </label>
              <input
                ref={imageInputRef}
                id="screening-image"
                type="file"
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-200 bg-cyan-50/50 p-6 text-center transition hover:border-cyan-500 hover:bg-cyan-50"
              >
                <FaCloudArrowUp
                  aria-hidden="true"
                  className="text-3xl text-cyan-700"
                />
                <span className="mt-3 font-bold text-slate-800">
                  {image ? image.name : "Choose an image to upload"}
                </span>
                <span className="mt-1 text-sm text-slate-500">
                  Images only · maximum file size 10 MB
                </span>
              </button>
              {image && (
                <img
                  src={imagePreview}
                  alt="Selected screening image preview"
                  className="mx-auto mt-5 max-h-72 max-w-full rounded-xl border border-slate-200 object-contain"
                />
              )}
            </div>
          ) : (
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map(({ name, label, step }) => (
                <div key={name}>
                  <label
                    htmlFor={`field-${name}`}
                    className="mb-1.5 block text-sm font-bold text-slate-700"
                  >
                    {label}
                  </label>
                  <input
                    id={`field-${name}`}
                    name={name}
                    type="number"
                    step={step}
                    value={values[name] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [name]: event.target.value,
                      }))
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>
              ))}
            </div>
          )}

          {errorMessage && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-cyan-700 px-5 py-3.5 font-extrabold text-white transition hover:bg-cyan-800 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Run screening"}
          </button>

          {result && (
            <section
              aria-live="polite"
              className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6"
            >
              <h2 className="text-lg font-extrabold text-emerald-950">
                Demonstration model output
              </h2>
              <p className="mt-1 text-sm font-semibold text-emerald-900">
                Not clinically validated and not a diagnosis.
              </p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-white/80 p-4 font-mono text-sm text-slate-800">
                {result}
              </pre>
              <div className="mt-4 flex items-start gap-3 text-sm leading-6 text-emerald-950">
                <FaShieldHeart aria-hidden="true" className="mt-1 shrink-0" />
                This automated result is decision support only, not a diagnosis.
                Please discuss it with a qualified clinician.
              </div>
            </section>
          )}
        </form>
      </div>
    </section>
  );
};

export default PredictionForm;
