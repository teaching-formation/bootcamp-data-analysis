# -*- coding: utf-8 -*-
"""Graphes d'illustration M02 (concepts) + M05/M12 (mauvais vs bon)."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import os

OUT = "/private/tmp/claude-502/-Users-youssouf-Documents-data-analyst-bootcamp/8517c6b4-a1ae-4d5c-b99e-98219d0d9433/scratchpad/viz_more"
os.makedirs(OUT, exist_ok=True)

ORANGE="#ea580c"; SKY="#0284c7"; SKY_L="#7dd3fc"; AMBER="#f59e0b"
GRAY="#94a3b8"; GRAY_D="#64748b"; TEXT="#1e293b"; GRID="#e2e8f0"; RED="#dc2626"; GREEN="#16a34a"
plt.rcParams.update({
    "svg.fonttype":"none","font.family":"sans-serif",
    "font.sans-serif":["Helvetica Neue","Arial","DejaVu Sans"],
    "text.color":TEXT,"axes.labelcolor":TEXT,"xtick.color":TEXT,"ytick.color":TEXT,
    "axes.edgecolor":GRID,"figure.facecolor":"white","axes.facecolor":"white","font.size":10,
})
def clean(ax):
    for s in ["top","right"]: ax.spines[s].set_visible(False)
    ax.tick_params(length=0); ax.set_axisbelow(True)
def save(fig,name):
    fig.tight_layout(); fig.savefig(f"{OUT}/{name}.svg", bbox_inches="tight", facecolor="white"); plt.close(fig)

rng = np.random.default_rng(7)

# ── M02 – 1) Distribution : symétrique vs asymétrique à droite ──
fig,(a1,a2)=plt.subplots(1,2,figsize=(10.5,3.9))
x=np.linspace(-4,4,400)
a1.fill_between(x, np.exp(-x**2/2), color=SKY, alpha=0.85)
a1.axvline(0, color=ORANGE, lw=2, ls="--")
a1.text(0,1.02,"moyenne ≈ médiane",ha="center",fontsize=10,color=GRAY_D)
a1.set_title("Distribution symétrique (en cloche)",fontsize=12,fontweight="bold",loc="left")
a1.set_yticks([]); clean(a1); a1.set_xticks([])
# skewed right : lognormal-like
xs=np.linspace(0,6,400); pdf=(1/(xs+0.15))*np.exp(-(np.log(xs+0.15)+0.2)**2/0.6)
a2.fill_between(xs, pdf, color=SKY, alpha=0.85)
med=0.9; mean=1.5
a2.axvline(med, color=AMBER, lw=2, ls="--"); a2.axvline(mean, color=ORANGE, lw=2, ls="--")
a2.text(med,max(pdf)*1.02,"médiane",ha="center",fontsize=9.5,color=AMBER,fontweight="bold")
a2.text(mean,max(pdf)*0.86,"moyenne",ha="left",fontsize=9.5,color=ORANGE,fontweight="bold")
a2.set_title("Asymétrique à droite : moyenne > médiane",fontsize=12,fontweight="bold",loc="left")
a2.set_yticks([]); a2.set_xticks([]); clean(a2)
save(fig,"m02_1_distribution")

# ── M02 – 2) Histogramme (concept) ──
data = np.concatenate([rng.normal(50,10,220), rng.normal(52,9,180)])
fig,ax=plt.subplots(figsize=(7.6,3.9))
ax.hist(data, bins=12, color=SKY, edgecolor="white", zorder=3)
ax.set_title("Un histogramme montre la FORME de la distribution",fontsize=12.5,fontweight="bold",loc="left",pad=8)
ax.set_xlabel("Valeur (regroupée en tranches)",color=GRAY); ax.set_ylabel("Nombre d'observations",color=GRAY)
ax.yaxis.grid(True,color=GRID); clean(ax)
save(fig,"m02_2_histogramme")

# ── M02 – 3) Boîte à moustaches ANNOTÉE ──
vals=np.array([180,200,310,340,360,380,420,450,540,580,590,610,620,950,1800])
q1,med,q3=np.percentile(vals,[25,50,75]); iqr=q3-q1
low=vals[vals>=q1-1.5*iqr].min(); high=vals[vals<=q3+1.5*iqr].max()
fig,ax=plt.subplots(figsize=(8.4,3.6))
bp=ax.boxplot(vals, vert=False, widths=0.5, patch_artist=True,
    medianprops=dict(color=ORANGE,lw=2.5),
    flierprops=dict(marker="o",markerfacecolor=RED,markeredgecolor="white",markersize=11))
bp["boxes"][0].set_facecolor(SKY_L); bp["boxes"][0].set_edgecolor(GRAY_D)
for w in bp["whiskers"]+bp["caps"]: w.set_color(GRAY_D)
def ann(xv,txt,dy,color=TEXT):
    ax.annotate(txt, xy=(xv,1), xytext=(xv,1+dy), ha="center", fontsize=9.5, fontweight="bold", color=color,
                arrowprops=dict(arrowstyle="-",color=color,lw=1))
ann(q1,"Q1",0.33,SKY); ann(med,"Médiane",0.46,ORANGE); ann(q3,"Q3",0.33,SKY)
ann(low,"Moustache",-0.42,GRAY_D); ann(high,"Moustache",-0.42,GRAY_D); ann(1800,"Outlier",0.33,RED)
# IQR bracket
ax.annotate("", xy=(q1,0.63),xytext=(q3,0.63),arrowprops=dict(arrowstyle="<->",color=GREEN,lw=1.6))
ax.text((q1+q3)/2,0.55,"IQR (50 % du milieu)",ha="center",fontsize=9,color=GREEN,fontweight="bold")
ax.set_title("Comment lire une boîte à moustaches",fontsize=12.5,fontweight="bold",loc="left",pad=8)
ax.set_yticks([]); ax.set_xlabel("Salaire (k FCFA)",color=GRAY); clean(ax)
for s in ["left"]: ax.spines[s].set_visible(False)
ax.set_ylim(0.4,1.6)
save(fig,"m02_3_boxplot_annote")

# ── M02 – 4) Corrélations : positive / négative / nulle ──
n=40; x=rng.uniform(0,10,n)
fig,axes=plt.subplots(1,3,figsize=(11,3.5))
ypos=1.1*x+rng.normal(0,1.4,n); yneg=12-1.1*x+rng.normal(0,1.4,n); ynone=rng.uniform(0,12,n)
for ax,(yv,ttl,col) in zip(axes,[(ypos,"Corrélation positive",GREEN),(yneg,"Corrélation négative",ORANGE),(ynone,"Pas de corrélation",GRAY_D)]):
    ax.scatter(x,yv,s=45,color=SKY,edgecolor="white",lw=0.8,zorder=3)
    if ttl!="Pas de corrélation":
        m,b=np.polyfit(x,yv,1); xs=np.array([0,10]); ax.plot(xs,m*xs+b,ls="--",color=col,lw=1.8)
    ax.set_title(ttl,fontsize=11.5,fontweight="bold",color=col); ax.set_xticks([]); ax.set_yticks([]); clean(ax)
save(fig,"m02_4_correlations")

# ── M05/M12 – 5) Mauvais (camembert) vs Bon (barres) ──
fig,(axb,axg)=plt.subplots(1,2,figsize=(11,4.3))
pie_l=["MTN","Orange","Moov","Autres","Sans SIM","Inconnu"]; pie_v=[11.2,9.4,6.1,1.3,2.0,0.8]
axb.pie(pie_v,labels=pie_l,autopct="%1.0f%%",colors=[ORANGE,SKY,AMBER,GRAY,SKY_L,"#fdba74"],
        startangle=90,counterclock=False,textprops={"fontsize":9},wedgeprops={"edgecolor":"white","linewidth":1.5})
axb.set_title("MAUVAIS — camembert à 6 parts\n(impossible de classer d'un coup d'œil)",fontsize=11,fontweight="bold",color=RED,pad=8)
ops=["MTN","Orange","Moov","Autres"]; v=[11.2,9.4,6.1,1.3]
o=np.argsort(v); ops=[ops[i] for i in o]; v=[v[i] for i in o]
cs=[ORANGE if x==max(v) else SKY for x in v]
gb=axg.barh(ops,v,color=cs,height=0.6,zorder=3)
for b,val in zip(gb,v): axg.text(val+0.15,b.get_y()+b.get_height()/2,f"{val:.1f} M",va="center",fontsize=10,fontweight="bold")
axg.set_title("BON — barres triées\n(le classement saute aux yeux)",fontsize=11,fontweight="bold",color=GREEN,pad=8)
axg.xaxis.grid(True,color=GRID); clean(axg); axg.set_xlim(0,max(v)*1.18)
for s in ["left"]: axg.spines[s].set_visible(False)
save(fig,"m05_5_camembert_vs_barres")

# ── M05 – 6) Axe tronqué vs axe à zéro ──
cats=["Jan","Fév","Mar","Avr"]; vv=[96,98,97,99]
fig,(a1,a2)=plt.subplots(1,2,figsize=(11,4.0))
a1.bar(cats,vv,color=RED,width=0.6,zorder=3); a1.set_ylim(95,100)
a1.set_title("MAUVAIS — axe tronqué (démarre à 95)\ndifférences visuellement ÉNORMES",fontsize=11,fontweight="bold",color=RED,pad=8)
a1.yaxis.grid(True,color=GRID); clean(a1)
a2.bar(cats,vv,color=SKY,width=0.6,zorder=3); a2.set_ylim(0,105)
a2.set_title("BON — axe à zéro\ndifférences réelles (à peine visibles)",fontsize=11,fontweight="bold",color=GREEN,pad=8)
a2.yaxis.grid(True,color=GRID); clean(a2)
save(fig,"m05_6_axe_tronque")

print("OK — graphes générés")
for f in sorted(os.listdir(OUT)): print(" ",f, os.path.getsize(os.path.join(OUT,f)),"o")
