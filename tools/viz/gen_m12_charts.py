# -*- coding: utf-8 -*-
"""Génère les 5 graphes d'illustration du M12, palette marque, en SVG."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import os

OUT = "/private/tmp/claude-502/-Users-youssouf-Documents-data-analyst-bootcamp/8517c6b4-a1ae-4d5c-b99e-98219d0d9433/scratchpad/viz_m12"
os.makedirs(OUT, exist_ok=True)

ORANGE="#ea580c"; SKY="#0284c7"; SKY_L="#7dd3fc"; AMBER="#f59e0b"
GRAY="#94a3b8"; TEXT="#1e293b"; GRID="#e2e8f0"
plt.rcParams.update({
    "svg.fonttype": "none",
    "font.family": "sans-serif",
    "font.sans-serif": ["Helvetica Neue","Arial","DejaVu Sans"],
    "text.color": TEXT,"axes.labelcolor": TEXT,"xtick.color": TEXT,"ytick.color": TEXT,
    "axes.edgecolor": GRID,"figure.facecolor":"white","axes.facecolor":"white","font.size":10,
})

# ── données Bamba & Associés (identiques au module) ──
dept = ["RH","Finance","Commercial","RH","Direction","IT","Commercial","Finance",
        "IT","Commercial","RH","Finance","IT","Commercial","Direction"]
contrat = ["CDI","CDI","CDI","CDD","CDI","CDI","Stage","CDI","CDI","CDD","CDI","CDI","Stage","CDI","CDI"]
sal = [450000,620000,380000,310000,1800000,580000,180000,540000,610000,340000,420000,590000,200000,360000,950000]
anc = [5,8,3,1,12,6,0,7,9,2,4,7,0,3,10]
sal = np.array(sal); anc = np.array(anc)

def clean(ax, left=True):
    for s in (["top","right","left"] if not left else ["top","right"]):
        ax.spines[s].set_visible(False)
    ax.tick_params(length=0)
    ax.set_axisbelow(True)

def save(fig, name):
    fig.tight_layout()
    fig.savefig(f"{OUT}/{name}.svg", bbox_inches="tight", facecolor="white")
    plt.close(fig)

# 1) Histogramme des salaires + moyenne/médiane
fig, ax = plt.subplots(figsize=(7.6, 4.0))
ax.hist(sal/1e6, bins=6, color=SKY, edgecolor="white", zorder=3)
ax.axvline(sal.mean()/1e6, color=ORANGE, ls="--", lw=2, label=f"Moyenne : {sal.mean():,.0f} FCFA".replace(",", " "))
ax.axvline(np.median(sal)/1e6, color=AMBER, ls="--", lw=2, label=f"Médiane : {np.median(sal):,.0f} FCFA".replace(",", " "))
ax.set_title("Distribution des salaires — Bamba & Associés", fontsize=13, fontweight="bold", loc="left", pad=10)
ax.set_xlabel("Salaire (millions de FCFA)", color=GRAY); ax.set_ylabel("Nombre d'employés", color=GRAY)
ax.yaxis.grid(True, color=GRID); clean(ax); ax.legend(frameon=False, fontsize=9)
save(fig, "1_histogramme")

# 2) Barres — salaire moyen par département (trié)
depts = sorted(set(dept))
moy = {d: sal[[i for i,x in enumerate(dept) if x==d]].mean() for d in depts}
order = sorted(moy, key=moy.get, reverse=True)
vals = [moy[d]/1e6 for d in order]
colors = [ORANGE if v==max(vals) else SKY for v in vals]
fig, ax = plt.subplots(figsize=(7.6, 4.0))
bars = ax.bar(order, vals, color=colors, width=0.62, zorder=3)
for b,v in zip(bars, vals):
    ax.text(b.get_x()+b.get_width()/2, v+0.03, f"{v*1e6:,.0f}".replace(",", " "), ha="center", fontsize=9, fontweight="bold")
ax.set_title("Salaire moyen par département", fontsize=13, fontweight="bold", loc="left", pad=10)
ax.set_ylabel("Salaire moyen (FCFA)", color=GRAY)
ax.yaxis.grid(True, color=GRID); clean(ax); ax.set_ylim(0, max(vals)*1.18)
save(fig, "2_barres")

# 3) Boîte à moustaches — salaire par contrat
groups = ["CDI","CDD","Stage"]
data = [sal[[i for i,x in enumerate(contrat) if x==g]] for g in groups]
fig, ax = plt.subplots(figsize=(7.6, 4.0))
bp = ax.boxplot(data, patch_artist=True, widths=0.5, tick_labels=groups,
                medianprops=dict(color=ORANGE, lw=2),
                flierprops=dict(marker="o", markerfacecolor=ORANGE, markeredgecolor="white", markersize=8))
for patch, c in zip(bp["boxes"], [SKY, SKY_L, "#bae6fd"]):
    patch.set_facecolor(c); patch.set_edgecolor(GRAY)
for w in bp["whiskers"]+bp["caps"]: w.set_color(GRAY)
ax.set_title("Distribution des salaires par type de contrat", fontsize=13, fontweight="bold", loc="left", pad=10)
ax.set_ylabel("Salaire (FCFA)", color=GRAY)
ax.yaxis.grid(True, color=GRID); clean(ax)
save(fig, "3_boxplot")

# 4) Camembert — répartition des contrats
from collections import Counter
cnt = Counter(contrat); labels=["CDI","CDD","Stage"]; sizes=[cnt[l] for l in labels]
fig, ax = plt.subplots(figsize=(6.4, 4.6))
ax.pie(sizes, labels=labels, autopct="%1.0f%%", colors=[ORANGE, SKY, SKY_L],
       explode=[0.05,0,0], startangle=90, counterclock=False,
       textprops={"fontsize":11}, wedgeprops={"edgecolor":"white","linewidth":2})
ax.set_title("Répartition des types de contrat", fontsize=13, fontweight="bold", pad=10)
save(fig, "4_camembert")

# 5) Nuage de points — ancienneté vs salaire (+ tendance)
fig, ax = plt.subplots(figsize=(7.6, 4.4))
palette = {"RH":ORANGE,"Finance":SKY,"Commercial":"#16a34a","Direction":"#9333ea","IT":AMBER}
for d in depts:
    idx=[i for i,x in enumerate(dept) if x==d]
    ax.scatter(anc[idx], sal[idx]/1e6, s=90, color=palette[d], edgecolor="white", lw=1, label=d, zorder=3)
# droite de tendance
m,b = np.polyfit(anc, sal/1e6, 1); xs=np.array([anc.min(), anc.max()])
ax.plot(xs, m*xs+b, ls="--", color=GRAY, lw=1.5, zorder=2)
ax.set_title("Ancienneté vs Salaire, par département", fontsize=13, fontweight="bold", loc="left", pad=10)
ax.set_xlabel("Ancienneté (années)", color=GRAY); ax.set_ylabel("Salaire (M FCFA)", color=GRAY)
ax.yaxis.grid(True, color=GRID); ax.xaxis.grid(True, color=GRID); clean(ax)
ax.legend(frameon=False, fontsize=8.5, ncol=5, loc="upper center", bbox_to_anchor=(0.5, -0.18))
save(fig, "5_nuage")

print("OK — 5 SVG générés")
for f in sorted(os.listdir(OUT)):
    print(" ", f, os.path.getsize(os.path.join(OUT,f)), "o")
