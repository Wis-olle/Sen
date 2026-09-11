@echo off
rem Khởi động backend DeepTutor (Python, fork Wis-olle/DeepTutor) ở cổng 8001, dữ liệu nằm trong <DEEPTUTOR_DIR>\data.
rem Cài một lần: git clone https://github.com/Wis-olle/DeepTutor.git "E:\AI Agents\DeepTutor" && cd đó && uv venv --python 3.14 && uv pip install -e .
if "%DEEPTUTOR_DIR%"=="" set "DEEPTUTOR_DIR=E:\AI Agents\DeepTutor"
cd /d "%DEEPTUTOR_DIR%" || exit /b 1
.venv\Scripts\deeptutor.exe serve --port 8001
