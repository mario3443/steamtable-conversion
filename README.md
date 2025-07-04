# steamtable-conversion - 蒸汽表性質查詢工具
![image](https://github.com/user-attachments/assets/ef4752a5-5854-46c8-b3e7-51abb46c4244)

## 學習背景
這份專案是我在化工系大一下課程-質能均衡中，為了可以簡化查詢蒸氣表（steamtable）時所花費的時間所做出的小工具。

## 功能介紹
一進畫面會先看到蒸汽表的性質查詢功能

可以依照你的需求選擇要自由度為1或2（可以先利用Gibbs's function決定)

![image](https://github.com/user-attachments/assets/716edbce-05be-4109-bb5f-e6d222639ef1)

選擇後即可以輸入你所擁有的條件來進行蒸氣表的查詢

![image](https://github.com/user-attachments/assets/6fc2ec43-5a41-4ff2-8a2c-edade09daf10)

![image](https://github.com/user-attachments/assets/faddc9c5-5bc1-445d-ba7e-6393943d064c)

按下查詢後送出即可以利用後台的CSV檔案查詢到所有資料（包含一定誤差內的數據）呈現在畫面

![image](https://github.com/user-attachments/assets/485b9677-36c4-4db3-86d4-797183901f1a)

並且在往後也可以保存和清除歷史資料

![image](https://github.com/user-attachments/assets/aaa3457e-c9a4-4ebf-930b-faccd19572ac)

## 如何使用

先clone此專案到你的資料夾中

進入資料夾並且在終端輸入

```python flask_server.py```

和

```npm run dev```

即會出現以下畫面後便可進入網頁並使用工具

![image](https://github.com/user-attachments/assets/827aaf4a-b8e1-4121-817d-b50f03f8809c)

## 學習或利用到的知識

#### - React 前端框架（建立元件）

#### - 基本 HTML / CSS

#### - Flask（後端邏輯處理與資料查詢）

#### - CSV整理（整理來自網路的蒸汽表資料為適合計算的格式）

# 資料來源

本專案所使用的 Steam Table 原始資料來源為：

## LearnChemE - https://learncheme.com/student-resources/steam-tables/
