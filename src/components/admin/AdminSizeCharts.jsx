import { useEffect, useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import { createSizeChart, deleteSizeChart, getSizeCharts, updateSizeChart } from "../../api";

const BRAND = "#E11D48";
const empty = () => ({ template_name: "", heading: "Size Chart", note: "Expected deviation < 3%", is_active: true, columns: ["Size", "Chest (round)", "Length", "Sleeve"], rows: [{ Size: "S", "Chest (round)": "", Length: "", Sleeve: "" }] });

export default function AdminSizeCharts() {
  const [items, setItems] = useState([]); const [form, setForm] = useState(empty());
  const [open, setOpen] = useState(false); const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const load = () => getSizeCharts(true).then(setItems).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  const showNew = () => { setEditing(null); setForm(empty()); setOpen(true); };
  const showEdit = (chart) => { setEditing(chart.id); setForm({ ...chart, columns: [...chart.columns], rows: chart.rows.map((r) => ({ ...r })) }); setOpen(true); };
  const addColumn = () => { const name = window.prompt("Measurement name (for example Waist)"); if (!name?.trim() || form.columns.includes(name.trim())) return; setForm((f) => ({ ...f, columns: [...f.columns, name.trim()], rows: f.rows.map((r) => ({ ...r, [name.trim()]: "" })) })); };
  const removeColumn = (column) => setForm((f) => ({ ...f, columns: f.columns.filter((c) => c !== column), rows: f.rows.map((row) => { const next = { ...row }; delete next[column]; return next; }) }));
  const addRow = () => setForm((f) => ({ ...f, rows: [...f.rows, Object.fromEntries(f.columns.map((c) => [c, c === "Size" ? "" : ""]))] }));
  const save = async () => { setBusy(true); setError(""); try { editing ? await updateSizeChart(editing, form) : await createSizeChart(form); setOpen(false); load(); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  const remove = async (chart) => { if (!window.confirm(`Delete “${chart.template_name}”?`)) return; try { await deleteSizeChart(chart.id); load(); } catch (e) { setError(e.message); } };
  return <div className="space-y-5">
    <div className="flex items-center justify-between"><div><h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Size Charts</h2><p className="text-sm text-gray-500">Reusable measurement templates for product pages.</p></div><button onClick={showNew} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: BRAND }}><AddOutlinedIcon style={{ fontSize: 18 }} /> Create size chart</button></div>
    {error && <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">{items.length ? items.map((chart) => <div key={chart.id} className="flex items-center gap-3 px-4 py-3 border-b last:border-0 border-gray-100"><span className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500"><StraightenOutlinedIcon /></span><div className="flex-1"><p className="font-semibold text-gray-800">{chart.template_name}</p><p className="text-xs text-gray-400">{chart.columns.join(" · ")} · {chart.rows.length} sizes</p></div><span className={`text-xs px-2 py-1 rounded-full ${chart.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{chart.is_active ? "Available" : "Inactive"}</span><button onClick={() => showEdit(chart)} className="p-2 text-gray-500"><EditOutlinedIcon style={{ fontSize: 18 }} /></button><button onClick={() => remove(chart)} className="p-2 text-gray-500 hover:text-red-600"><DeleteOutlineIcon style={{ fontSize: 18 }} /></button></div>) : <p className="py-12 text-center text-sm text-gray-400">No size-chart templates yet.</p>}</div>
    {open && <div className="fixed inset-0 z-50 bg-black/40 p-3 sm:p-6 overflow-y-auto flex items-start justify-center"><div className="my-3 w-full max-w-5xl rounded-2xl bg-white shadow-xl">
      <div className="flex items-center justify-between px-6 py-5 border-b"><h3 className="font-bold text-gray-900">{editing ? "Edit size chart" : "Create size chart"}</h3><button onClick={() => setOpen(false)} className="text-gray-400"><CloseIcon /></button></div>
      <div className="p-6 sm:p-12 space-y-6"><div className="grid sm:grid-cols-2 gap-5"><Field label="Template name *"><input className="inp" value={form.template_name} onChange={(e) => setForm({ ...form, template_name: e.target.value })} placeholder="Men's T-shirt" /></Field><Field label="Chart heading"><input className="inp" value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} /></Field><Field label="Note"><input className="inp" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field><label className="flex items-center gap-2 pt-6 text-sm text-gray-600"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Available for products</label></div>
        <div><div className="flex justify-between"><p className="text-sm font-bold text-gray-800">Columns</p><button onClick={addColumn} className="text-xs font-medium" style={{ color: BRAND }}>+ Add measurement</button></div><div className="mt-3 flex flex-wrap gap-2">{form.columns.map((c, i) => <span key={c} className="min-w-[145px] rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-700 flex justify-between">{c}{i > 0 && <button onClick={() => removeColumn(c)} className="ml-3 text-gray-400">×</button>}</span>)}</div></div>
        <div><div className="flex justify-between"><p className="text-sm font-bold text-gray-800">Measurements in inches</p><button onClick={addRow} className="text-xs font-medium" style={{ color: BRAND }}>+ Add size</button></div><div className="mt-3 overflow-x-auto rounded-lg border"><table className="w-full min-w-[700px] text-sm"><thead><tr className="bg-gray-50">{form.columns.map((c) => <th key={c} className="px-3 py-2.5 text-left font-semibold text-gray-700">{c}</th>)}<th /></tr></thead><tbody>{form.rows.map((row, ri) => <tr key={ri}>{form.columns.map((c) => <td key={c} className="p-1.5"><input className="inp" value={row[c] ?? ""} onChange={(e) => setForm((f) => ({ ...f, rows: f.rows.map((r, i) => i === ri ? { ...r, [c]: e.target.value } : r) }))} /></td>)}<td><button onClick={() => setForm((f) => ({ ...f, rows: f.rows.filter((_, i) => i !== ri) }))} className="p-2 text-gray-400"><DeleteOutlineIcon style={{ fontSize: 17 }} /></button></td></tr>)}</tbody></table></div></div>
      </div><div className="flex justify-end gap-3 px-12 py-6 border-t"><button onClick={() => setOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600">Cancel</button><button onClick={save} disabled={busy} className="rounded-lg px-10 py-2.5 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: BRAND }}>{busy ? "Saving…" : "Save template"}</button></div>
      <style>{`.inp{width:100%;border:1px solid #dbe1e8;border-radius:.5rem;padding:.6rem .75rem;font-size:.875rem;outline:none}.inp:focus{border-color:#9ca3af}`}</style>
    </div></div>}
  </div>;
}
function Field({ label, children }) { return <label><span className="block mb-1 text-xs font-medium text-gray-500">{label}</span>{children}</label>; }
