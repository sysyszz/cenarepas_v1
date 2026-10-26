import { useState } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

const MAX_SIZE_MB = 5;

// `carpeta` identifica el destino de la imagen (ej. "productos"). Mientras no exista
// un endpoint de subida en el backend, la imagen se entrega como data URL (base64).
export function ImageUploader({ carpeta, value = '', onChange, label = 'Imagen' }) {
  const [urlInput, setUrlInput] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`La imagen no debe superar los ${MAX_SIZE_MB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onChange?.(reader.result);
    reader.readAsDataURL(file);
  };

  const handleLoadUrl = () => {
    if (urlInput.trim()) {
      onChange?.(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div data-carpeta={carpeta} className="modal-field-wide space-y-2.5 p-3.5 rounded-xl border border-border bg-muted/20">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-primary" />
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange?.('')}
            className="text-xs text-destructive hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Eliminar imagen
          </button>
        )}
      </div>

      {value ? (
        <div className="relative w-full h-44 rounded-lg border border-border bg-card overflow-hidden group">
          <img src={value} alt="Vista previa" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="cursor-pointer px-3 py-1.5 bg-background text-foreground text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 hover:bg-muted transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Cambiar archivo
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1.5">
              <Upload className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              Haz clic para seleccionar desde tu equipo
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              PNG, JPG, WEBP (máx. {MAX_SIZE_MB}MB)
            </p>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-muted-foreground block">
              O ingresa la URL de una imagen web:
            </span>
            <div className="flex gap-2">
              <input
                type="url"
                maxLength={255}
                placeholder="https://ejemplo.com/imagen.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-input bg-input-background rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={handleLoadUrl}
                className="px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-xs font-medium transition-colors"
              >
                Cargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
