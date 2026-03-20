# Deployment Progress - Collabstr Live!

## Completed ✅
- [x] Backend deployed: https://fie-j4au.onrender.com (Node/Express)
- [x] MongoDB Atlas setup (mongodb+srv://root:12345@cluster0.gj2mwpl.mongodb.net/)
- [x] backend/.env.example created (for reference)
- [x] frontend/.env: VITE_API_URL=https://fie-j4au.onrender.com (proxies API)
- [x] Frontend files restored (App.jsx confirmed working)

## Critical: Render Env Vars (add manually → auto-redeploy)
| Key | Value |
|----|-------|
| MONGODB_URI | `mongodb+srv://root:12345@cluster0.gj2mwpl.mongodb.net/collabstr?retryWrites=true&w=majority` |
| EMAIL_USER | `yourgmail@gmail.com` |
| EMAIL_PASS | `your_gmail_app_password` (Google: Security > App passwords > Select app 'Mail') |

**Atlas Check:** Ensure Network Access: Add IP 0.0.0.0/0.

## Next: Frontend Deploy (Vite Static)
```powershell
cd frontend
npm install
npm run build   # Creates dist/
npm i -g vercel
vercel --prod   # Links to fie-frontend.vercel.app
```
Update vite.config.js proxy target='https://fie-j4au.onrender.com/api' if needed.

## Git Clean
```powershell
git add -A
git commit -m "Deploy prep: env files + restore assets"
git checkout SK
git checkout main
git merge SK
git push origin main
```

## Test Flow
1. Frontend live → Register (name,email,pass) → Email OTP.
2. Verify OTP → Login → Dashboard (fetches /api/settings).
3. Create project → Payments → Charts live!

**Status: Backend 90% (await env vars). Frontend ready to build/deploy.** 🚀

**Run the git & frontend commands above. Share Render logs after env vars!**
