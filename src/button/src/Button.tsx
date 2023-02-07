import { h, computed, defineComponent } from "vue";
import useTheme from "../../hooks/useTheme";
import { alpha } from "../../utils/color";
import "./style/index.less";

export const buttonProps = {
  color: String,
  textColor: String,
  loading: Boolean,
  disabled: Boolean,
  circle: Boolean,
} as const;

export type ButtonProps = typeof buttonProps;

const Button = defineComponent({
  name: "Button",
  props: buttonProps,
  setup(props) {
    const { theme, isDark } = useTheme();
    const reliefStyle = computed(() => {
      const relief = theme.value.relief;
      const insetBoxShadowColor = alpha(
        props.color ?? relief.bg,
        isDark.value ? 0.1 : 0.3
      );

      const boxShadowColor = alpha(
        relief.boxShadow,
        isDark.value && props.color ? 0.8 : 0.3
      );

      return {
        "--relief-btn-bg": props.color ?? relief.bg,
        "--relief-btn-color": props.textColor ?? relief.color,
        "--relief-btn-shadow": boxShadowColor,
        "--relief-btn-inset-shadow": insetBoxShadowColor,
      };
    });

    const reliefCss = computed(() => {
      return {
        "relief-button": true,
        "relief-button--circle": props.circle,
      };
    });

    return {
      reliefStyle,
      reliefCss,
    };
  },
  render() {
    const { reliefStyle, reliefCss, $attrs, $slots } = this;
    return (
      <button class={reliefCss} style={reliefStyle} {...$attrs}>
        {$slots.default?.()}
      </button>
    );
  },
});

export default Button;
