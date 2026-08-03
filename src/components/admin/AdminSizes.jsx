import { useEffect, useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import { createSize, deleteSize, getSizes, updateSize } from "../../api";

const BRAND = "#E11D48";
const EMPTY = { name: "", sort_order: 0, is_active: true };

export default function AdminSizes() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => getSizes(true).then(setItems).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Enter a size name.");
    setBusy(true); setError("");
    try {
      if (editing) await updateSize(editing, form); else await createSize(form);
      setEditing(null); setForm(EMPTY); load();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  const edit = (size) => { setEditing(size.id); setForm({ name: size.name, sort_order: size.sort_order, is_active: size.is_active }); };
  const remove = async (size) => {
    if (!window.confirm(`Delete size “${size.name}”?`)) return;
    try { await deleteSize(size.id); load(); } catch (err) { setError(err.message); }
  };

  return <div className="space-y-5">
    <div><h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Sizes</h2><p className="text-sm text-gray-500">Create reusable sizes, then assign stock to each size on a product.</p></div>
    {error && <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}
    <form onSubmit={save} className="rounded-xl border border-gray-100 bg-white p-4 grid sm:grid-cols-[1fr_150px_auto_auto] gap-3 items-end">
      <label><span className="text-xs font-medium text-gray-500">Size name</span><input className="inp mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="S, M, 2-3 Years…" /></label>
      <label><span className="text-xs font-medium text-gray-500">Display order</span><input className="inp mt-1" type="number" min="0" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></label>
      <label className="flex items-center gap-2 pb-2.5 text-sm text-gray-600"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
      <button disabled={busy} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: BRAND }}><AddOutlinedIcon style={{ fontSize: 17 }} /> {editing ? "Update" : "Create"}</button>
    </form>
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      {items.length === 0 ? <p className="py-12 text-center text-sm text-gray-400">No sizes created yet.</p> : items.map((s) => <div key={s.id} className="flex items-center gap-3 px-4 py-3 border-b last:border-0 border-gray-100">
        <span className="h-9 w-9 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center"><StraightenOutlinedIcon style={{ fontSize: 18 }} /></span>
        <div className="flex-1"><p className="font-semibold text-gray-800">{s.name}</p><p className="text-xs text-gray-400">Order {s.sort_order}</p></div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{s.is_active ? "Active" : "Inactive"}</span>
        <button onClick={() => edit(s)} className="p-2 text-gray-500 hover:text-gray-900"><EditOutlinedIcon style={{ fontSize: 18 }} /></button>
        <button onClick={() => remove(s)} className="p-2 text-gray-500 hover:text-red-600"><DeleteOutlineIcon style={{ fontSize: 18 }} /></button>
      </div>)}
    </div>
    <style>{`.inp{width:100%;border:1px solid #e5e7eb;border-radius:.5rem;padding:.625rem .75rem;font-size:.875rem;outline:none}.inp:focus{border-color:#9ca3af}`}</style>
  </div>;
}
