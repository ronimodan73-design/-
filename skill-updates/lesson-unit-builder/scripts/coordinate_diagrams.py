"""
Diagrams for שיעור 1 כיתה ז' — מערכת הצירים (first quadrant only).
Extends Roni's math_diagrams library conventions:
  - NO Hebrew inside images (matplotlib RTL is unreliable)
  - transparent PNG output
  - shared palette
  - print-safe: every distinction readable in greyscale (line weight / label,
    never colour alone)
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import os

NAVY = "#2F4858"
TEAL = "#1F5C52"
RED = "#C0392B"
GOLD = "#D9A400"
GREY = "#999999"
LIGHT_GREY = "#CCCCCC"

OUT = os.path.dirname(os.path.abspath(__file__))


def _new(figsize=(4.2, 4.0)):
    fig, ax = plt.subplots(figsize=figsize, dpi=200)
    ax.set_aspect("equal")
    ax.axis("off")
    return fig, ax


def _save(fig, name):
    path = os.path.join(OUT, name)
    plt.tight_layout(pad=0.25)
    plt.savefig(path, transparent=True, bbox_inches="tight")
    plt.close(fig)
    print("wrote", path)


def _axes(ax, xmax=6.6, ymax=6.2, arrows=True, xname="x", yname="y",
          ticks=True, tick_positions=None, tick_labels=True, lw=1.8,
          origin_label=True):
    """Standard first-quadrant axes."""
    if arrows:
        ax.annotate("", xy=(xmax, 0), xytext=(0, 0),
                    arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=lw))
        ax.annotate("", xy=(0, ymax), xytext=(0, 0),
                    arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=lw))
    else:
        ax.plot([0, xmax], [0, 0], color=NAVY, lw=lw, solid_capstyle="butt")
        ax.plot([0, 0], [0, ymax], color=NAVY, lw=lw, solid_capstyle="butt")

    ax.text(xmax + 0.15, -0.05, xname, fontsize=13, color=NAVY,
            ha="left", va="center", style="italic")
    ax.text(-0.1, ymax + 0.18, yname, fontsize=13, color=NAVY,
            ha="center", va="bottom", style="italic")

    if ticks:
        xs = tick_positions if tick_positions else range(1, int(xmax) + 1)
        for i in xs:
            if i > xmax - 0.4:
                continue
            ax.plot([i, i], [-0.11, 0.11], color=NAVY, lw=1.3)
            if tick_labels:
                ax.text(i, -0.42, str(i), fontsize=9.5, color=NAVY, ha="center")
        ys = tick_positions if tick_positions else range(1, int(ymax) + 1)
        for i in ys:
            if i > ymax - 0.4:
                continue
            ax.plot([-0.11, 0.11], [i, i], color=NAVY, lw=1.3)
            if tick_labels:
                ax.text(-0.38, i, str(i), fontsize=9.5, color=NAVY,
                        ha="center", va="center")

    if origin_label:
        ax.text(-0.38, -0.42, "O", fontsize=11, color=NAVY,
                ha="center", va="center")
    ax.set_xlim(-1.0, xmax + 0.9)
    ax.set_ylim(-1.0, ymax + 0.9)


def _grid(ax, xmax=6.6, ymax=6.2):
    for i in range(1, int(xmax) + 1):
        if i <= xmax - 0.4:
            ax.plot([i, i], [0, ymax - 0.4], color=LIGHT_GREY, lw=0.7, zorder=0)
    for i in range(1, int(ymax) + 1):
        if i <= ymax - 0.4:
            ax.plot([0, xmax - 0.4], [i, i], color=LIGHT_GREY, lw=0.7, zorder=0)


def _point(ax, x, y, label, dx=0.22, dy=0.22, color=TEAL, show_coords=True):
    ax.plot([x], [y], "o", color=color, markersize=7, zorder=5)
    txt = f"{label}({x},{y})" if show_coords else label
    ax.text(x + dx, y + dy, txt, fontsize=10.5, color=color,
            ha="left", va="bottom", fontweight="bold")


# ---------------------------------------------------------------- 1. valid
def fig_valid():
    fig, ax = _new()
    _grid(ax)
    _axes(ax)
    _save(fig, "fig_01_valid.png")


# --------------------------------------------- 2a. axes not perpendicular
def fig_bad_perpendicular():
    fig, ax = _new()
    import math
    ang = math.radians(58)
    ax.annotate("", xy=(6.6, 0), xytext=(0, 0),
                arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.8))
    ax.annotate("", xy=(6.2 * math.cos(ang), 6.2 * math.sin(ang)), xytext=(0, 0),
                arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.8))
    ax.text(6.75, -0.05, "x", fontsize=13, color=NAVY, ha="left",
            va="center", style="italic")
    ax.text(6.2 * math.cos(ang) - 0.35, 6.2 * math.sin(ang) + 0.15, "y",
            fontsize=13, color=NAVY, ha="center", va="bottom", style="italic")
    # highlight the offending angle
    import matplotlib.patches as mp
    ax.add_patch(mp.Arc((0, 0), 2.0, 2.0, theta1=0, theta2=58,
                        color=RED, lw=2.0))
    ax.text(1.35, 0.52, "58°", fontsize=11, color=RED, fontweight="bold")
    for i in range(1, 7):
        ax.plot([i, i], [-0.11, 0.11], color=NAVY, lw=1.2)
    ax.text(-0.38, -0.42, "O", fontsize=11, color=NAVY, ha="center", va="center")
    ax.set_xlim(-1.0, 7.5)
    ax.set_ylim(-1.0, 7.1)
    _save(fig, "fig_02a_not_perpendicular.png")


# ------------------------------------------------ 2b. no common origin
def fig_bad_origin():
    fig, ax = _new()
    ax.annotate("", xy=(6.6, 0.9), xytext=(0.0, 0.9),
                arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.8))
    ax.annotate("", xy=(2.1, 6.2), xytext=(2.1, 2.0),
                arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.8))
    ax.text(6.75, 0.85, "x", fontsize=13, color=NAVY, ha="left",
            va="center", style="italic")
    ax.text(2.1, 6.4, "y", fontsize=13, color=NAVY, ha="center",
            va="bottom", style="italic")
    # mark the gap
    ax.plot([2.1, 2.1], [0.9, 2.0], color=RED, lw=2.2, linestyle=(0, (3, 2)))
    ax.plot([2.1], [0.9], "o", color=RED, markersize=6)
    ax.plot([2.1], [2.0], "o", color=RED, markersize=6)
    ax.text(2.45, 1.35, "?", fontsize=15, color=RED, fontweight="bold")
    ax.set_xlim(-1.0, 7.5)
    ax.set_ylim(-0.4, 7.1)
    _save(fig, "fig_02b_no_common_origin.png")


# ----------------------------------------------------- 2c. no arrows
def fig_bad_arrows():
    fig, ax = _new()
    _grid(ax)
    _axes(ax, arrows=False)
    _save(fig, "fig_02c_no_arrows.png")


# ------------------------------------------------ 2d. axis names swapped
def fig_bad_swapped():
    fig, ax = _new()
    _grid(ax)
    _axes(ax, xname="y", yname="x")
    _save(fig, "fig_02d_swapped_names.png")


# ---------------------------------------------- 2e. uneven tick spacing
def fig_bad_ticks():
    fig, ax = _new()
    _axes(ax, ticks=False)
    # uneven positions but labelled 1,2,3,4,5 -> unit value not constant
    positions = [0.7, 1.3, 2.6, 4.4, 5.0]
    for lbl, p in enumerate(positions, start=1):
        ax.plot([p, p], [-0.11, 0.11], color=NAVY, lw=1.3)
        ax.text(p, -0.42, str(lbl), fontsize=9.5, color=RED, ha="center",
                fontweight="bold")
    for i in range(1, 6):
        ax.plot([-0.11, 0.11], [i, i], color=NAVY, lw=1.3)
        ax.text(-0.38, i, str(i), fontsize=9.5, color=NAVY,
                ha="center", va="center")
    _save(fig, "fig_02e_uneven_ticks.png")


# ------------------------------------- 3. labelled points for reading/sorting
def fig_points():
    fig, ax = _new(figsize=(4.6, 4.3))
    _grid(ax)
    _axes(ax, origin_label=False)
    _point(ax, 2, 4, "A")
    _point(ax, 5, 0, "B", dx=0.18, dy=0.28)
    _point(ax, 0, 3, "C", dx=0.22, dy=0.20)
    _point(ax, 4, 2, "D")
    ax.plot([0], [0], "o", color=TEAL, markersize=7, zorder=5)
    ax.text(0.28, 0.30, "O(0,0)", fontsize=10.5, color=TEAL,
            fontweight="bold", ha="left", va="bottom")
    _save(fig, "fig_03_points_ABCD.png")


# ------------------------------- 3b. same points, coordinates hidden (to read)
def fig_points_unlabelled():
    fig, ax = _new(figsize=(4.6, 4.3))
    _grid(ax)
    _axes(ax, origin_label=False)
    _point(ax, 2, 4, "A", show_coords=False)
    _point(ax, 5, 0, "B", dx=0.18, dy=0.28, show_coords=False)
    _point(ax, 0, 3, "C", dx=0.22, dy=0.20, show_coords=False)
    _point(ax, 4, 2, "D", show_coords=False)
    ax.plot([0], [0], "o", color=TEAL, markersize=7, zorder=5)
    ax.text(0.28, 0.30, "O", fontsize=10.5, color=TEAL,
            fontweight="bold", ha="left", va="bottom")
    _save(fig, "fig_03b_points_to_read.png")


# --------------------------------------------------- 4. empty grid to mark on
def fig_empty():
    fig, ax = _new(figsize=(4.6, 4.3))
    _grid(ax)
    _axes(ax)
    _save(fig, "fig_04_empty_grid.png")


# --------------------------------- 5. corridor + elevator strategy for (4,3)
def fig_corridor():
    fig, ax = _new(figsize=(4.6, 4.3))
    _grid(ax)
    _axes(ax)
    ax.annotate("", xy=(4, 0), xytext=(0, 0),
                arrowprops=dict(arrowstyle="-|>", color=RED, lw=2.6))
    ax.annotate("", xy=(4, 3), xytext=(4, 0),
                arrowprops=dict(arrowstyle="-|>", color=RED, lw=2.6,
                                linestyle="--"))
    ax.text(2.0, -0.75, "1.  x = 4", fontsize=11, color=RED,
            ha="center", fontweight="bold")
    ax.text(4.35, 1.5, "2.  y = 3", fontsize=11, color=RED,
            ha="left", va="center", fontweight="bold")
    _point(ax, 4, 3, "A")
    _save(fig, "fig_05_corridor_elevator.png")


# ----------------------------------------------- 6. single point to read: A
def fig_read_A():
    fig, ax = _new(figsize=(4.3, 4.1))
    _grid(ax)
    _axes(ax)
    _point(ax, 3, 5, "A", show_coords=False)
    _save(fig, "fig_06_read_A.png")


# ------------------------------------------------------ 7. station map
def fig_stations():
    fig, ax = _new(figsize=(4.6, 4.3))
    _grid(ax)
    _axes(ax)
    _point(ax, 2, 4, "A", show_coords=False)
    _point(ax, 5, 0, "B", dx=0.18, dy=0.28, show_coords=False)
    _point(ax, 0, 3, "C", dx=0.22, dy=0.20, show_coords=False)
    _save(fig, "fig_07_stations.png")


# ------------------------------- 8. student's mislabelled axes (error hunt)
def fig_error_labels():
    fig, ax = _new()
    _grid(ax)
    _axes(ax, xname="y", yname="x")
    _point(ax, 3, 2, "P", show_coords=False)
    _save(fig, "fig_08_error_labels.png")


if __name__ == "__main__":
    fig_valid()
    fig_bad_perpendicular()
    fig_bad_origin()
    fig_bad_arrows()
    fig_bad_swapped()
    fig_bad_ticks()
    fig_points()
    fig_points_unlabelled()
    fig_empty()
    fig_corridor()
    fig_read_A()
    fig_stations()
    fig_error_labels()
    print("done")
