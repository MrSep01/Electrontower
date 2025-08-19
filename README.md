# Electron Towers

An interactive, single-file web app to teach and practice electron configurations using the **apartment building** analogy.
Works offline and on mobile. Includes:

- Study & Game modes
- **Diagonal Aufbau** diagram (clean dashed arrows)
- **Exceptions toggle** for Cr/Cu/Nb/Mo/Ru/Rh/Pd/Ag/Pt/Au
- Live readouts: full configuration and **noble‑gas shorthand**
- Mobile-friendly layout (iPad/iPhone)

---

## Quick Start (local)

1. Download this repo as a ZIP or clone it.
2. Open `index.html` in any modern browser (Chrome, Edge, Safari, Firefox).
3. No internet or server required.

---

## Deploy on GitHub Pages

> You only need **three files**: `index.html`, `README.md`, and `LICENSE` (optional).  
> Pages will serve `index.html` as your app.

1. **Create a new repo** on GitHub — e.g., `electron-towers`.
2. Upload the files from this folder (`index.html`, `README.md`, `LICENSE`, and optional `.nojekyll`).
3. Commit to the **`main`** branch.
4. Go to **Settings → Pages**.
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)`
   - Click **Save**.
5. Wait ~30–60 seconds; your app will appear at:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```
6. (Optional) Add a custom domain in **Settings → Pages**.

### Updating the app
- Edit `index.html` locally, then commit & push to `main`. Pages updates automatically.

---

## Features & Teaching Tips

- **Study Mode**: Click the glowing slot to place the next electron (no dragging).  
  Use **Auto‑play** to watch the sequence step‑by‑step.
- **Game Mode**: Drag or click electrons from the lobby; score for correct placements and rule adherence.
- **Exceptions**: Toggle on for realistic configurations (e.g., `Cr: [Ar] 3d⁵ 4s¹`, `Cu: [Ar] 3d¹⁰ 4s¹`).  
- **Noble‑gas shorthand**: Live below the full configuration so students learn both forms.
- **Aufbau Diagram**: Diagonal arrow flow with thin, dashed lines and rounded heads.

---

## Files

- `index.html` — the entire app (single file, self‑contained).
- `README.md` — this file.
- `LICENSE` — MIT (feel free to replace with your org’s license).
- `.nojekyll` — prevents Jekyll processing on Pages (harmless to include).

---

## License

MIT — see `LICENSE` for details.
