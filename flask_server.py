from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

# 初始化 Flask 應用
app = Flask(__name__)
CORS(app) # 允許跨域請求

# 載入 CSV 資料
pres_df = pd.read_csv("src/steam_data/saturated_by_pressure.csv") 
temp_df = pd.read_csv("src/steam_data/saturated_by_temperature.csv")

# 查詢函數
def query_saturated_data(property_name, value, tolerance=0.5):
    matches = []

    for df, label in [(pres_df, "by_pressure"), (temp_df, "by_temperature")]:
        if property_name not in df.columns:
            continue

        filtered = df[(df[property_name] - value).abs() <= tolerance]
        for _, row in filtered.iterrows():
            matches.append({
                "source": label,
                "match_on": property_name,
                "value": row[property_name],
                "data": row.to_dict()
            })

    return matches

# API 端點：F=1 蒸氣表反查
@app.route("/api/saturated", methods=["POST"])
def query_saturated():
    try:
        data = request.get_json()
        prop = data["property"]
        val = float(data["value"])
        result = query_saturated_data(prop, val)
        return jsonify({"matches": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
