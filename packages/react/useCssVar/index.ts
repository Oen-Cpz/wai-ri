// 参考(抄袭😀): https://vueuse.org/core/useCssVar/

import { useEffect } from 'react'
import { ref } from '../ref'
import { MaybeRef, unRefElement } from '../shared'


type StyleElement = SVGElement | HTMLElement | MathMLElement
type MaybeStyleElementRef = MaybeRef<StyleElement>

export function useCssVar(
  propName: string,
  target: MaybeStyleElementRef = globalThis.document.documentElement,
  initVal = ''
) {
  const cssVarRef = ref(initVal)

  useEffect(() => {
    const el = unRefElement(target)

    if (!el?.style) return
    // 动态target? 动态propName?

    el.style.setProperty(propName, cssVarRef.value)

  }, [cssVarRef, target])

  return cssVarRef
}

