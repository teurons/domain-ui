export interface ComponentCategory {
  slug: string
  name: string
  components: { name: string; type?: "free" | "pro" }[]
  isNew?: boolean
}

export const categories: ComponentCategory[] = [
  {
    slug: "typography",
    name: "Typography",
    components: [
      { name: "heading", type: "free" },
      { name: "sub-heading", type: "free" },
      { name: "page-title", type: "pro" },
    ],
  },
  {
    slug: "forms",
    name: "Forms",
    components: [
      { name: "regex-input", type: "free" },
      { name: "pan-input", type: "pro" },
    ],
  },
  {
    slug: "identity",
    name: "Identity Verification",
    components: [
      { name: "indian-passport", type: "pro" },
      { name: "uk-passport", type: "pro" },
      { name: "usa-passport", type: "pro" },
    ],
    isNew: true,
  },
  {
    slug: "display",
    name: "Display",
    components: [
      { name: "my-badge", type: "free" },
    ],
  },
]

export function getCategory(slug: string): ComponentCategory | undefined {
  return categories.find((category) => category.slug === slug)
}

export function getFreeComponents(): { name: string; category: string }[] {
  const freeComponents: { name: string; category: string }[] = []
  for (const category of categories) {
    for (const component of category.components) {
      if (!component.type || component.type === "free") {
        freeComponents.push({ name: component.name, category: category.slug })
      }
    }
  }
  return freeComponents
}

export function getProComponents(): { name: string; category: string }[] {
  const proComponents: { name: string; category: string }[] = []
  for (const category of categories) {
    for (const component of category.components) {
      if (component.type === "pro") {
        proComponents.push({ name: component.name, category: category.slug })
      }
    }
  }
  return proComponents
}