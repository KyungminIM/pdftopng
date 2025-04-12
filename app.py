from flask import Flask, render_template, request, send_file
from pdf2image import convert_from_bytes
from PIL import Image
import os
import io
import uuid

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/convert", methods=["POST"])
def convert_pdf_to_png():
    if "pdf_file" not in request.files:
        return "No file part", 400

    pdf_file = request.files["pdf_file"]

    if pdf_file.filename == "":
        return "No selected file", 400

    try:
        # PDF -> 이미지 변환
        images = convert_from_bytes(pdf_file.read(), dpi=200)  # 첫 페이지만 변환
        
        # 하나의 PNG 파일만 반환 (1페이지 기준)
        image = images[0]
        img_io = io.BytesIO()
        image.save(img_io, format="PNG")
        img_io.seek(0)

        return send_file(img_io, mimetype="image/png", as_attachment=False)

    except Exception as e:
        return f"변환 실패: {str(e)}", 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
