<script>
import { useThemeStore } from '@/stores/theme'

export default {
  onLaunch() {
    const themeStore = useThemeStore()
    themeStore.initTheme()

    // 监听系统主题变化
    uni.onThemeChange((res) => {
      themeStore.updateSystemTheme(res.theme)
    })
  },
  onShow() {
    // 每次回到前台时重新检查系统主题并更新导航栏
    const themeStore = useThemeStore()
    try {
      const info = uni.getSystemInfoSync()
      themeStore.updateSystemTheme(info.theme)
    } catch {}
    themeStore._updateNavBar()
  },
  onHide() {}
}
</script>

<style>
/* ========== 暗色主题变量（默认） ========== */
page {
  --bg-page: #0F1115;
  --bg-card: #121419;
  --bg-secondary: #161922;
  --bg-tertiary: #1F2635;
  --bg-mask: rgba(0, 0, 0, 0.5);
  --bg-float: rgba(31, 38, 53, 0.85);

  --text-primary: #DBE6FF;
  --text-secondary: #99A8C9;
  --text-muted: #6B7A99;
  --text-white: #FFFFFF;

  --accent-primary: #1847B1;
  --accent-lighter: #4976D0;
  --accent-lightest: #A1C4F7;
  --accent-mid: #8BB8F7;
  --accent-deep: #0C287F;
  --accent-gradient-end: #7BA3F0;

  --border-color: #262F43;

  --color-success: #7FE368;
  --color-warning: #F2C94C;
  --color-error: #EB5757;
  --color-check: #34C759;

  --star-empty: #3A4358;
  --star-filled: #F2C94C;

  --poster-bg: #1a1f2e;
  --watched-bg: #1A1F2E;
  --active-bg: #2A3344;
  --studio-tag-bg: #223355;
  --recap-bg: #2A1A33;
  --filler-bg: #332200;
  --status-border: #5A4A1A;
  --broadcast-border: #1A3A1A;

  --skeleton-from: #1a1f2e;
  --skeleton-to: #262f43;
}

/* ========== 亮色主题变量 ========== */
page .theme-light,
.theme-light {
  --bg-page: #F5F6FA;
  --bg-card: #FFFFFF;
  --bg-secondary: #F0F1F5;
  --bg-tertiary: #E5E7ED;
  --bg-mask: rgba(0, 0, 0, 0.35);
  --bg-float: rgba(255, 255, 255, 0.92);

  --text-primary: #1A1D26;
  --text-secondary: #5A6178;
  --text-muted: #8B92A8;
  --text-white: #FFFFFF;

  --accent-primary: #1847B1;
  --accent-lighter: #3568B8;
  --accent-lightest: #2B5CA8;
  --accent-mid: #2D5EA8;
  --accent-deep: #0C287F;
  --accent-gradient-end: #7BA3F0;

  --border-color: #DDE0E8;

  --color-success: #34C759;
  --color-warning: #C8960A;
  --color-error: #DC3545;
  --color-check: #34C759;

  --star-empty: #D0D3DB;
  --star-filled: #C8960A;

  --poster-bg: #E8EAF0;
  --watched-bg: #EDF0F7;
  --active-bg: #DDE2EC;
  --studio-tag-bg: #E0E5F0;
  --recap-bg: #F0E8F5;
  --filler-bg: #FFF3D6;
  --status-border: #E0C878;
  --broadcast-border: #A3D9A3;

  --skeleton-from: #E8EAF0;
  --skeleton-to: #DDE0E8;
}
</style>
