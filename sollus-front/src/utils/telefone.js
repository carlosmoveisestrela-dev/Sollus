// src/utils/telefone.js

// Remove tudo que não é dígito
export function apenasNumeros(valor) {
  return (valor || "").replace(/\D/g, "")
}

// Aplica a máscara (11) 91234-5678 conforme o usuário digita
export function mascararCelular(valor) {
  const numeros = apenasNumeros(valor).slice(0, 11) // trava em 11 dígitos

  if (numeros.length === 0) return ""
  if (numeros.length <= 2) return `(${numeros}`
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
}

// Valida DDD (01 a 99, sem DDD 00) + celular com 9 no início do número (11 dígitos totais)
export function celularValido(valor) {
  const numeros = apenasNumeros(valor)

  if (numeros.length !== 11) return false

  const ddd = numeros.slice(0, 2)
  const nono = numeros.charAt(2)

  if (ddd === "00") return false
  if (nono !== "9") return false

  return true
}