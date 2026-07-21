import { ref, reactive } from 'vue'

const selectedArticle = ref(null)
const articleRawCache = reactive({})

export function useArticleState() {
  function selectArticle(article) {
    selectedArticle.value = article
  }

  function clearArticle() {
    selectedArticle.value = null
  }

  function setArticleRaw(slug, raw) {
    articleRawCache[slug] = raw
  }

  function getArticleRaw(slug) {
    return articleRawCache[slug] || null
  }

  return {
    selectedArticle,
    selectArticle,
    clearArticle,
    setArticleRaw,
    getArticleRaw
  }
}
