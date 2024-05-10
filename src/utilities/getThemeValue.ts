/** @format */

import { BaseTheme, PropValue, StyleTransformFunction } from '../types'

/**
 * Returns value from a theme for a given `themeKey`, applying `transform` if defined.
 */
export function getThemeValue<TVal extends PropValue, Theme extends BaseTheme, K extends keyof Theme | undefined>(
  value: TVal | undefined,
  {
    theme,
    transform,
    themeKey,
  }: {
    theme: Theme
    transform?: StyleTransformFunction<Theme, K, TVal>
    themeKey?: K
  }
) {
  if (transform) return transform({ value, theme, themeKey })

  if (isThemeKey(theme, themeKey)) {
    const customValue = theme[themeKey][value as string]

    if (typeof value === 'string' && themeKey === 'colors' && (value as string).includes('.')) {
      return getNestedColorValue(theme[themeKey], value)
    }

    if (value && customValue === undefined) throw new Error(`Value '${value}' does not exist in theme['${String(themeKey)}']`)

    return value ? customValue : value
  }

  return value
}

function isThemeKey<Theme extends BaseTheme>(theme: Theme, K: keyof Theme | undefined): K is keyof Theme {
  return theme[K as keyof Theme]
}

function getNestedColorValue(theme: BaseTheme, value: string): string | undefined {
  const keys = value.split('.')
  let nestedValue: any = theme

  for (const key of keys) {
    nestedValue = nestedValue[key]
  }

  return nestedValue
}
