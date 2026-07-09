/**
 * Funções básicas para trabalhar com cookies no navegador.
 * Isso é só para fins de demonstração/teste — o app principal
 * continua usando localStorage (ver hooks/useLocalStorage.js).
 */

/** Lê o valor de um cookie pelo nome. Retorna null se não existir. */
export function getCookie(nome) {
  const todos = document.cookie.split("; ").filter(Boolean);
  for (const item of todos) {
    const [chave, ...resto] = item.split("=");
    if (chave === nome) {
      return decodeURIComponent(resto.join("="));
    }
  }
  return null;
}

/**
 * Grava um cookie.
 * @param {string} nome
 * @param {string} valor
 * @param {number} segundos - tempo de vida em segundos (omitir = cookie de sessão, morre ao fechar o navegador)
 */
export function setCookie(nome, valor, segundos) {
  let cookieStr = `${nome}=${encodeURIComponent(valor)}; path=/; SameSite=Lax`;
  if (typeof segundos === "number") {
    cookieStr += `; max-age=${segundos}`;
  }
  document.cookie = cookieStr;
}

/** Remove um cookie (definindo expiração no passado). */
export function deleteCookie(nome) {
  document.cookie = `${nome}=; path=/; max-age=0`;
}

/** Lista todos os cookies atuais como um array de {nome, valor}. */
export function listarCookies() {
  return document.cookie
    .split("; ")
    .filter(Boolean)
    .map((item) => {
      const [chave, ...resto] = item.split("=");
      return { nome: chave, valor: decodeURIComponent(resto.join("=")) };
    });
}

/** Retorna o tamanho aproximado em bytes de todos os cookies do domínio. */
export function tamanhoTotalCookies() {
  return new Blob([document.cookie]).size;
}
