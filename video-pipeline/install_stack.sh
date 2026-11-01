#!/bin/bash
# Install manim (pip) + TinyTeX (user-space LaTeX) for the video pipeline.
# Log: /home/z/my-project/scripts/video/install.log
set -x
export HOME=/home/z/my-project

echo "=== [1/3] pip install manim ==="
pip install --no-cache-dir manim 2>&1
echo "PIP_EXIT=$?"

echo "=== [2/3] TinyTeX download ==="
cd /home/z/my-project/scripts/video
wget -q -O install-bin-unix.sh "https://yihui.org/tinytex/install-bin-unix.sh"
echo "WGET_EXIT=$?"
sh install-bin-unix.sh 2>&1
echo "TINYTEX_EXIT=$?"

echo "=== [3/3] TeX packages for manim ==="
export PATH=/home/z/my-project/.TinyTeX/bin/x86_64-linux:$PATH
tlmgr install standalone preview amsmath amssymb doublestroke dvisvgm everysel fontspec 2>&1
echo "TLMGR_EXIT=$?"

echo "INSTALL_ALL_DONE"
