import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getCategorias } from '../../categorias/services/categoriasService';
import { getFichasTecnicas } from '../../fichas-tecnicas/services/fichasTecnicasService';
import { getProveedores } from '../../proveedores/services/proveedoresService';
import { Combobox } from '../../../shared/ui/Combobox';
import { ImageUploader } from '../../../shared/components/ImageUploader';

export function ProductoFormModal({ open, onClose, producto = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [idCategoria, setIdCategoria] = useState('1');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idFicha, setIdFicha] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [estado, setEstado] = useState('activo');

  const [categorias, setCategorias] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    getCategorias().then((data) => {
      if (Array.isArray(data)) setCategorias(data);
    }).catch(() => {});
    getFichasTecnicas().then((data) => {
      if (Array.isArray(data)) setFichas(data);
    }).catch(() => {});
    getProveedores().then((data) => {
      if (Array.isArray(data)) setProveedores(data);
    }).catch(() => {});
  }, []);


  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || '');
      setIdCategoria(producto.id_categoria ? String(producto.id_categoria) : (categorias[0]?.id_categoria ? String(categorias[0].id_categoria) : '1'));
      setPrecioVenta(producto.precio_venta != null ? String(producto.precio_venta) : '');
      setStockActual(producto.stock_actual != null ? String(producto.stock_actual) : '0');
      setDescripcion(producto.descripcion || '');
      setIdFicha(producto.id_ficha ? String(producto.id_ficha) : '');
      setIdProveedor(producto.id_proveedor ? String(producto.id_proveedor) : '');
      setImagenUrl(producto.imagen_url || '');
      setStockMinimo(producto.stock_minimo != null ? String(producto.stock_minimo) : '0');
      setFechaVencimiento(producto.fecha_vencimiento || '');
      setEstado(producto.estado || 'activo');
    } else {
      setNombre('');
      setIdCategoria(categorias[0]?.id_categoria ? String(categorias[0].id_categoria) : '1');
      setPrecioVenta('');
      setStockActual('0');
      setDescripcion('');
      setIdFicha('');
      setIdProveedor('');
      setImagenUrl('');
      setStockMinimo('0');
      setFechaVencimiento('');
      setEstado('activo');
    }
  }, [producto, open, categorias]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const payload = producto
      ? {
          ...producto,
          nombre: nombre.trim(),
          id_categoria: Number(idCategoria) || 1,
          precio_venta: Number(precioVenta) || 0,
          stock_actual: Number(stockActual) || 0,
          descripcion: descripcion.trim() || null,
          id_ficha: idFicha ? Number(idFicha) : null,
          id_proveedor: idProveedor ? Number(idProveedor) : null,
          imagen_url: imagenUrl.trim() || null,
          stock_minimo: Number(stockMinimo) || 0,
          fecha_vencimiento: fechaVencimiento || null,
          estado,
        }
      : {
          nombre: nombre.trim(),
          id_categoria: Number(idCategoria) || 1,
          precio_venta: Number(precioVenta) || 0,
          stock_actual: Number(stockActual) || 0,
          descripcion: descripcion.trim() || null,
          id_ficha: idFicha ? Number(idFicha) : null,
          id_proveedor: idProveedor ? Number(idProveedor) : null,
          imagen_url: imagenUrl.trim() || null,
          stock_minimo: Number(stockMinimo) || 0,
          fecha_vencimiento: fechaVencimiento || null,
          estado: estado || 'activo',
        };

    if (onSave) {
      onSave(payload);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="form-modal-panel bg-card p-6 rounded-xl max-w-lg w-full border border-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Completa la información y características del producto terminado
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-grid space-y-4">
          <div className="modal-field-wide">
            <label htmlFor="producto_nombre" className="block mb-1.5 text-sm font-medium">Nombre del Producto *</label>
            <input
              id="producto_nombre"
              name="nombre"
              type="text"
              maxLength={100}
              required
              placeholder="Ej. Arepa con Queso Mozzarella"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="producto_id_categoria" className="block mb-1.5 text-sm font-medium">Categoría *</label>
              <Combobox
                id="producto_id_categoria"
                name="id_categoria"
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
                options={categorias.map((cat) => ({
                  value: String(cat.id_categoria),
                  label: cat.nombre,
                }))}
              />
            </div>
            <div>
              <label htmlFor="producto_precio_venta" className="block mb-1.5 text-sm font-medium">Precio de Venta ($) *</label>
              <input
                id="producto_precio_venta"
                name="precio_venta"
                type="number"
                step="50"
                min="0"
                required
                placeholder="Ej. 8500"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="producto_stock_actual" className="block mb-1.5 text-sm font-medium">Stock Inicial</label>
              <input
                id="producto_stock_actual"
                name="stock_actual"
                type="number"
                min="0"
                placeholder="Ej. 100"
                value={stockActual}
                onChange={(e) => setStockActual(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="producto_stock_minimo" className="block mb-1.5 text-sm font-medium">Stock Mínimo</label>
              <input
                id="producto_stock_minimo"
                name="stock_minimo"
                type="number"
                min="0"
                placeholder="Ej. 20"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="modal-field-wide">
            <label htmlFor="producto_descripcion" className="block mb-1.5 text-sm font-medium">Descripción</label>
            <textarea
              id="producto_descripcion"
              name="descripcion"
              rows={2}
              maxLength={255}
              placeholder="Descripción breve de los ingredientes y presentación..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <ImageUploader
            carpeta="productos"
            label="Imagen del Producto"
            value={imagenUrl}
            onChange={setImagenUrl}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="producto_fecha_vencimiento" className="block mb-1.5 text-sm font-medium">Fecha de Vencimiento</label>
              <input
                id="producto_fecha_vencimiento"
                name="fecha_vencimiento"
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="producto_id_ficha" className="block mb-1.5 text-sm font-medium">Ficha Técnica (Receta)</label>
              <Combobox
                id="producto_id_ficha"
                name="id_ficha"
                value={idFicha}
                placeholder="Sin ficha técnica"
                onChange={(e) => setIdFicha(e.target.value)}
                options={[
                  { value: '', label: 'Sin ficha técnica' },
                  ...fichas.map((f) => ({
                    value: String(f.id_ficha),
                    label: f.nombre,
                  })),
                ]}
              />
            </div>
            <div>
              <label htmlFor="producto_id_proveedor" className="block mb-1.5 text-sm font-medium">Proveedor (Opcional)</label>
              <Combobox
                id="producto_id_proveedor"
                name="id_proveedor"
                value={idProveedor}
                placeholder="Sin proveedor"
                onChange={(e) => setIdProveedor(e.target.value)}
                options={[
                  { value: '', label: 'Sin proveedor' },
                  ...proveedores.map((p) => ({
                    value: String(p.id_proveedor),
                    label: p.nombre,
                  })),
                ]}
              />
            </div>
          </div>

          <div className="modal-field-wide">
            <label htmlFor="producto_estado" className="block mb-1.5 text-sm font-medium">Estado</label>
            <Combobox
              id="producto_estado"
              name="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
            />
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              {isLoading ? 'Guardando...' : producto ? 'Guardar Cambios' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
