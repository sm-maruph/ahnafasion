import { COLOR_HEX, normalizeHex } from "./productColors";
import "./ColorVariantsEditor.css";

export default function ColorVariantsEditor({ value, onChange, error }) {
  const update = (index, patch) => onChange(value.map((color, i) => i === index ? { ...color, ...patch } : color));
  const suggestions = Object.entries(COLOR_HEX).filter(([name]) => name !== "gray" && !value.some((c) => c.name.trim().toLowerCase() === name));
  return <fieldset className="af-color-editor">
    <legend>Color variants</legend>
    <p>Choose a suggested color or add your own name and hex code.</p>
    <div className="af-color-suggestions" aria-label="Suggested colors">
      {suggestions.map(([name, hex]) => <button type="button" key={name} onClick={() => onChange([...value, { name: name[0].toUpperCase() + name.slice(1), hex: normalizeHex(hex) }])}>
        <span style={{ backgroundColor: hex }} aria-hidden="true" /> {name} <code>{normalizeHex(hex)}</code>
      </button>)}
    </div>
    <datalist id="af-product-color-names">{Object.entries(COLOR_HEX).map(([name, hex]) => <option key={name} value={name}>{normalizeHex(hex)}</option>)}</datalist>
    <div className="af-color-rows">
      {value.map((color, index) => <div className="af-color-row" key={index}>
        <label>Color name<input className="inp" aria-label={`Color ${index + 1} name`} list="af-product-color-names" value={color.name} placeholder="e.g. Sage Green" onChange={(event) => {
          const name = event.target.value;
          const hex = COLOR_HEX[name.trim().toLowerCase()];
          update(index, { name, ...(hex ? { hex: normalizeHex(hex) } : {}) });
        }} /></label>
        <label>Picker<input type="color" aria-label={`Color ${index + 1} picker`} value={normalizeHex(color.hex) || "#9ca3af"} onChange={(event) => update(index, { hex: event.target.value.toUpperCase() })} /></label>
        <label>Hex code<input className="inp" aria-label={`Color ${index + 1} hex code`} value={color.hex} placeholder="#D4AF37" maxLength={7} aria-invalid={!normalizeHex(color.hex)} onChange={(event) => update(index, { hex: event.target.value })} onBlur={() => { const hex = normalizeHex(color.hex); if (hex) update(index, { hex }); }} /></label>
        <button type="button" className="af-color-remove" aria-label={`Remove color ${index + 1}`} onClick={() => onChange(value.filter((_, i) => i !== index))}>Remove</button>
      </div>)}
    </div>
    <button type="button" className="af-color-add" onClick={() => onChange([...value, { name: "", hex: "#D4AF37" }])}>+ Add custom color</button>
    {error && <p role="alert" className="af-color-error">{error}</p>}
  </fieldset>;
}
