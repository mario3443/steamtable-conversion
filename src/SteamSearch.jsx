import { useState } from "react";

const propertyOptions = [
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

export default function SteamSearch() {
  const [property, setProperty] = useState("Hg (kJ/kg)");
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!value) {
      setError("請輸入數值");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/saturated", {
        // 之後要換成API網址
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ property, value: parseFloat(value) }),
      });

      if (!response.ok) throw new Error("伺服器錯誤");

      const data = await response.json();
      setResults(data.matches);
      setError("");
    } catch (err) {
      setError("查詢失敗：" + err.message);
      setResults([]);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1>飽和蒸氣表查詢（F = 1）</h1>
      <label>
        選擇已知性質：
        <select value={property} onChange={(e) => setProperty(e.target.value)}>
          {propertyOptions.map((prop) => (
            <option key={prop} value={prop}>
              {prop}
            </option>
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
      <br />
      <button style={{ marginTop: "1rem" }} onClick={handleSearch}>
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
                <strong>來源：</strong>
                {res.source}
              </p>
              <p>
                <strong>最接近值：</strong>
                {res.value}
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
