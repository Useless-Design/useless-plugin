import { computed, ComputedRef, onMounted, Ref, ref } from "vue";

export interface Theme {
  colors: {
    primary: string;
  };
  relief: {
    bg: string;
    color: string;
    boxShadow: string;
    insetBoxShadow: string;
  };
}

const darkTheme: Theme = {
  colors: {
    primary: "#0070f3",
  },
  /** 浮雕按钮背景色 */
  relief: {
    bg: "#242424",
    color: "#fff",
    boxShadow: "rgba(0, 0, 0, 0.35)",
    insetBoxShadow: "#242424",
  },
};

const lightTheme: Theme = {
  colors: {
    primary: "#0070f3",
  },
  /** 浮雕按钮背景色 */
  relief: {
    bg: "#e9ecef",
    color: "#333",
    boxShadow: "rgba(0, 0, 0, 0.35)",
    insetBoxShadow: "#e9ecef",
  },
};

export interface ThemeRef {
  theme: ComputedRef<Theme>;
  isDark: Ref<boolean>;
}

function useTheme(): ThemeRef {
  const isDark = ref(false);

  onMounted(() => {
    const html = document.querySelector("html") as HTMLElement;
    // 初次进入页面时，判断当前主题
    isDark.value = html.classList.contains("dark");
    // 监听主题变化
    const observer = new MutationObserver(() => {
      isDark.value = html.classList.contains("dark");
    });
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });

  const theme = computed(() => {
    return isDark.value ? darkTheme : lightTheme;
  });

  return {
    theme,
    isDark,
  };
}

export default useTheme;
