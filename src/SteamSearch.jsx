import { useState } from "react";

const f1Options = [
  "Pressure (MPa)",
  "Temperature (°C)",
  "Hg (kJ/kg)",
  "Hf (kJ/kg)",
  "Sg (kJ/kg.K)",
  "Sf (kJ/kg.K)",
  "Ug (kJ/kg)",
  "Uf (kJ/kg)",
  "Vg (m3/kg)",
  "Vf (m3/kg)",
];

const f2Options = [
  "Pressure (MPa)",
  "Temperature (°C)",
  "Specific Volume (m3/kg)",
  "Density (kg/m3)",
  "Internal Energy (kJ/kg)",
  "Enthalpy (kJ/kg)",
  "Entropy (kJ/kg.K)",
];

export default function SteamSearch() {
  const [mode, setMode] = useState("f1");

  // F1 State
  const [property, setProperty] = useState("Hg (kJ/kg)");
  const [value, setValue] = useState("");

  // F2 State
  const [prop1, setProp1] = useState("Pressure (MPa)");
  const [val1, setVal1] = useState("");
  const [prop2, setProp2] = useState("Temperature (°C)");
  const [val2, setVal2] = useState("");

  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      let response;

      if (mode === "f1") {
        if (!value) return setError("請輸入數值");

        response = await fetch("http://127.0.0.1:5000/api/saturated", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ property, value: parseFloat(value) }),
        });
      } else {
        if (!val1 || !val2) return setError("請輸入兩個性質的值");

        response = await fetch("http://127.0.0.1:5000/api/superheated", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            property1: prop1,
            value1: parseFloat(val1),
            property2: prop2,
            value2: parseFloat(val2),
          }),
        });
      }

      if (!response.ok) throw new Error("伺服器錯誤");
      const data = await response.json();

      if (!data.matches || data.matches.length === 0) {
        setError("查無符合條件的資料");
        setResults([]);
        return;
      }

      setResults(data.matches);
      setError("");
    } catch (err) {
      setError("查詢失敗：" + err.message);
      setResults([]);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
      <h1>蒸氣性質查詢工具</h1>

      <label>
        模式選擇：
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="f1">飽和蒸氣（F = 1）</option>
          <option value="f2">過熱蒸氣（F = 2）</option>
        </select>
      </label>

      {mode === "f1" ? (
        <div>
          <label>
            選擇已知性質：
            <select
              value={property}
              onChange={(e) => setProperty(e.target.value)}
            >
              {f1Options.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <br />
          <label>
            輸入數值：
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              step="any"
            />
          </label>
        </div>
      ) : (
        <div>
          <label>
            性質一：
            <select value={prop1} onChange={(e) => setProp1(e.target.value)}>
              {f2Options.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <input
              type="number"
              value={val1}
              onChange={(e) => setVal1(e.target.value)}
              step="any"
            />
          </label>
          <br />
          <label>
            性質二：
            <select value={prop2} onChange={(e) => setProp2(e.target.value)}>
              {f2Options.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <input
              type="number"
              value={val2}
              onChange={(e) => setVal2(e.target.value)}
              step="any"
            />
          </label>
        </div>
      )}

      <br />
      <button onClick={handleSearch} style={{ marginTop: "1rem" }}>
        查詢
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>查詢結果：</h3>
          {results.map((res, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                marginBottom: "1rem",
                padding: "1rem",
              }}
            >
              <p>
                <strong>匹配值：</strong> {res.value.join(", ")}
                <br />
                <strong>資料內容：</strong>
              </p>
              <table>
                <tbody>
                  {Object.entries(res.data).map(([key, val]) => (
                    <tr key={key}>
                      <td style={{ paddingRight: "1rem" }}>{key}</td>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
