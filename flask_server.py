from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# 載入飽和資料
pres_df = pd.read_csv("src/steam_data/saturated_by_pressure.csv")
temp_df = pd.read_csv("src/steam_data/saturated_by_temperature.csv")

# 載入 superheated steam 並加欄位名稱
superheat_df = pd.read_csv("src/steam_data/superheated_steam.csv", skiprows=1, header=None)
superheat_df.columns = [
    "Pressure (MPa)", "Temperature (°C)", "Specific Volume (m3/kg)",
    "Density (kg/m3)", "Internal Energy (kJ/kg)", "Enthalpy (kJ/kg)",
    "Entropy (kJ/kg.K)", "Phase"
]
# 去除欄位名稱的前後空白
superheat_df.columns = superheat_df.columns.str.strip()

# 將數值欄位轉為數字型態，Phase 欄位保留為字串
for col in superheat_df.columns:
    if col != "Phase":  # Phase 是字串，不轉
        superheat_df[col] = pd.to_numeric(superheat_df[col], errors="coerce")

# 查詢 F=1
@app.route("/api/saturated", methods=["POST"])
def query_saturated():
    try:
        data = request.get_json()
        prop = data["property"]
        val = float(data["value"])
        result = []

        for df, label in [(pres_df, "by_pressure"), (temp_df, "by_temperature")]:
            if prop not in df.columns:
                continue
            df = df.copy()  # F=1時也只顯示最接近的三筆數據
            df["_diff"] = (df[prop] - val).abs()
            filtered = df[df["_diff"] <= 0.5].nsmallest(3, "_diff")

        for _, row in filtered.iterrows():
            result.append({
                "source": label,
                "match_on": prop,
                "value": row[prop],
                "data": row.drop("_diff").to_dict()
            })


        return jsonify({"matches": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 查詢 F=2
@app.route("/api/superheated", methods=["POST"])
def query_superheated():
    try:
        data = request.get_json()
        prop1, val1 = data["property1"], float(data["value1"])
        prop2, val2 = data["property2"], float(data["value2"])

        # 過濾出 prop1 和 prop2 都存在的資料
        if prop1 not in superheat_df.columns or prop2 not in superheat_df.columns:
            return jsonify({"error": "無效的屬性名稱"}), 400

        # 新增欄位 total_diff 做排序
        df = superheat_df.copy()
        df["_total_diff"] = ((df[prop1] - val1).abs() + (df[prop2] - val2).abs())

        closest = df.nsmallest(3, "_total_diff")  # 取前 3 筆最接近的結果

        result = []
        for _, row in closest.iterrows():
            result.append({
                "match_on": [prop1, prop2],
                "value": [row[prop1], row[prop2]],
                "data": row.drop("_total_diff").to_dict()
            })

        return jsonify({"matches": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
