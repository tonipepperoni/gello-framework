/**
 * @gello/mail-templates
 *
 * React Email template system for Gello mail.
 * Provides pre-built components, theme system, and template engine.
 */

// Theme
export {
  type MailTheme,
  type MailThemeBrand,
  type MailThemeColors,
  type MailThemeFonts,
  type MailThemeLayout,
  type MailThemeFooter,
  type MailThemeInput,
  defaultTheme,
  defineMailTheme,
  ThemeProvider,
  useMailTheme,
} from "./lib/theme/index.js"

// Components
export {
  // Layout
  BaseLayout,
  type BaseLayoutProps,
  Section,
  type SectionProps,
  Card,
  type CardProps,
  Divider,
  type DividerProps,
  Spacer,
  type SpacerProps,
  // Typography
  Heading,
  type HeadingProps,
  Text,
  type TextProps,
  Link,
  type LinkProps,
  Code,
  type CodeProps,
  // Actions
  Button,
  type ButtonProps,
  // Data
  Badge,
  type BadgeProps,
  Alert,
  type AlertProps,
} from "./lib/components/index.js"

// Engine
export {
  ReactEmailEngineLive,
  registerTemplate,
  registerTemplates,
  getTemplate,
  clearTemplates,
  renderEmail,
  renderDirect,
  renderElement,
  type EmailTemplate,
  type TemplateRegistry,
} from "./lib/engine/index.js"
