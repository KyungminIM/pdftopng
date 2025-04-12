document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("upload-form");
    const resultSection = document.getElementById("result-section");
    const imagePreview = document.getElementById("image-preview");
    const downloadLink = document.getElementById("download-link");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // 기본 제출 막기

        const fileInput = document.getElementById("pdf-file");
        const file = fileInput.files[0];

        if (!file) {
            alert("PDF 파일을 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("pdf_file", file);

        try {
            const response = await fetch("/convert", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("서버 오류 또는 변환 실패");
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            // 이미지 미리보기 설정
            imagePreview.innerHTML = "";
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = "변환된 이미지";
            imagePreview.appendChild(img);

            // 다운로드 링크 설정
            downloadLink.href = imageUrl;
            downloadLink.download = "converted.png";

            // 결과 섹션 표시
            resultSection.style.display = "block";

        } catch (error) {
            alert("파일 변환 중 문제가 발생했습니다: " + error.message);
        }
    });
});
