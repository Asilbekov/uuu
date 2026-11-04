# v2pk — collect videos from wave-3 render kernels, zip per kernel for fast download
import os, zipfile

KERNELS = ["uuu-v2w2", "uuu-v2w3", "uuu-v2w4", "uuu-v2w5", "uuu-v2w6", "uuu-v2w7"]
lines = [f"INPUT ROOT: {sorted(os.listdir('/kaggle/input'))}"]
found = {k: [] for k in KERNELS}
for root, dirs, files in os.walk("/kaggle/input"):
    for k in KERNELS:
        if f"/{k}/" in root + "/" or root.rstrip("/").endswith("/" + k):
            for f in files:
                if f.endswith(".mp4"):
                    found[k].append(os.path.join(root, f))
for k in KERNELS:
    mp4s = sorted(set(found[k]))
    if not mp4s:
        lines.append(f"{k}: NO MP4")
        continue
    out = f"/kaggle/working/{k}.zip"
    with zipfile.ZipFile(out, "w", zipfile.ZIP_STORED) as z:
        for q in mp4s:
            arc = os.path.join("videos", os.path.basename(os.path.dirname(q)), os.path.basename(q))
            z.write(q, arc)
            srt = q[:-4] + ".srt"
            if os.path.exists(srt):
                z.write(srt, arc[:-4] + ".srt")
    lines.append(f"{k}: {len(mp4s)} mp4 -> {os.path.getsize(out)//1048576} MB")
open("/kaggle/working/pack_report.txt", "w").write("\n".join(lines))
print("\n".join(lines))
