#!/bin/bash
cd "$(dirname "$0")"
python3 generer.py
git add .
git commit -m "Mise a jour des points"
git push
echo "✅ Mise à jour terminée ! Tu peux fermer cette fenêtre."