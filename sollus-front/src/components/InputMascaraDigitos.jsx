import React, { useEffect, useRef, useState } from "react"
import { Input } from "antd"

// Input de dinheiro/quantidade no padrão BR: digitação livre da parte inteira
// (milhar formatado automaticamente com pontos) e vírgula para iniciar a
// parte decimal, limitada a `casas` dígitos. Ex: 15258,3655 -> 15.258,3655
//
// IMPORTANTE: o estado interno de verdade é `bruto` (dígitos + no máximo uma
// vírgula, SEM pontos de milhar). O texto com pontos é gerado só para exibição.
// Nunca reprocessamos o texto já mascarado (com pontos) como se fosse entrada
// nova — isso é o que causava o bug de "reiniciar" ao passar de 999 para 1000
// (o ponto de milhar virava vírgula decimal na tecla seguinte).
export function InputMascaraDigitos({
  value,
  onChange,
  casas = 4,
  style,
  placeholder,
  disabled,
}) {
  const [bruto, setBruto] = useState("") // ex: "15258,3655" (sem pontos de milhar)
  const origemInterna = useRef(false)

  function formatarExibicao(valorBruto) {
    if (!valorBruto && valorBruto !== "0") return ""

    const partes = valorBruto.split(",")
    let inteiro = partes[0].replace(/\D/g, "")
    const temVirgula = partes.length > 1

    if (inteiro.length > 1) {
      inteiro = inteiro.replace(/^0+/, "") || "0"
    }
    if (inteiro === "") inteiro = "0"

    const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    const decimal = temVirgula ? partes[1].replace(/\D/g, "").slice(0, casas) : null

    return temVirgula ? `${inteiroFormatado},${decimal}` : inteiroFormatado
  }

  // Só resincroniza a partir do `value` externo quando a mudança NÃO veio
  // do próprio usuário digitando neste input.
  useEffect(() => {
    if (origemInterna.current) {
      origemInterna.current = false
      return
    }
    if (value === null || value === undefined || value === "") {
      setBruto("")
      return
    }
    const strValor = String(value).replace(".", ",")
    setBruto(strValor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  function handleChange(e) {
    // Remove tudo que não é dígito ou vírgula, usando o valor exibido (que
    // pode ter pontos de milhar) — mas os pontos são DESCARTADOS, não
    // convertidos em vírgula, já que são só decoração visual.
    let inputVal = e.target.value.replace(/\./g, "").replace(/[^\d,]/g, "")

    // Aceita "," ou o usuário digitando literalmente uma vírgula onde havia ponto
    // (já tratado acima). Garante no máximo uma vírgula.
    const partes = inputVal.split(",")
    if (partes.length > 2) {
      inputVal = `${partes[0]},${partes.slice(1).join("")}`
    }

    // Limita as casas decimais
    const partesFinal = inputVal.split(",")
    if (partesFinal.length > 1) {
      inputVal = `${partesFinal[0]},${partesFinal.slice(1).join("").slice(0, casas)}`
    }

    setBruto(inputVal)

    if (!inputVal) {
      origemInterna.current = true
      onChange(null)
      return
    }

    const partesNum = inputVal.split(",")
    const intPuro = partesNum[0].replace(/\D/g, "") || "0"
    const decPuro = partesNum[1] !== undefined ? partesNum[1] : null
    const stringFloat = decPuro !== null ? `${intPuro}.${decPuro || 0}` : intPuro
    const numero = Number(stringFloat)

    if (!isNaN(numero)) {
      origemInterna.current = true
      onChange(numero)
    }
  }

  function handleKeyDown(e) {
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "Enter",
        "Escape",
      ].includes(e.key) ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return
    }

    if (/^[0-9]$/.test(e.key)) {
      return
    }

    // Permite iniciar a parte decimal com vírgula OU ponto (convertido), só uma vez
    if ((e.key === "," || e.key === ".") && !bruto.includes(",")) {
      return
    }

    e.preventDefault()
  }

  return (
    <Input
      style={style}
      value={formatarExibicao(bruto)}
      placeholder={placeholder}
      disabled={disabled}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      inputMode="decimal"
    />
  )
}