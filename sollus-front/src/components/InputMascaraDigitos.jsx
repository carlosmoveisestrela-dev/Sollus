import React, { useEffect, useRef, useState } from "react"
import { Input } from "antd"

export function InputMascaraDigitos({
  value,
  onChange,
  casas = 4,
  style,
  placeholder,
  disabled,
}) {
  const [bruto, setBruto] = useState("")
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
  }, [value])

  function handleChange(e) {

    let inputVal = e.target.value.replace(/\./g, "").replace(/[^\d,]/g, "")

    const partes = inputVal.split(",")
    if (partes.length > 2) {
      inputVal = `${partes[0]},${partes.slice(1).join("")}`
    }

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