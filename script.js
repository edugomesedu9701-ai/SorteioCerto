const inputText = document.querySelectorAll('input[type="text"]')
const checkbox = document.querySelector('input[type="checkbox"]')
const form = document.querySelector("form")
const main = document.getElementById("sorter")

// Selecionando cada input separadamente para capturar os dados
const numbersAmount = document.getElementById("number")
const inputMin = document.getElementById("from")
const inputMax = document.getElementById("to")

// 🎯 LISTA DE NÚMEROS PERMITIDOS
// Só serão sorteados números que estiverem aqui E dentro do intervalo escolhido.
// Deixe o array vazio [] para sortear normalmente dentro do intervalo.
const NUMEROS_PERMITIDOS = [15, 13, 98]

// Acessibilidade: adiciona rótulo ao switch
checkbox.setAttribute("aria-label", "Não repetir número")

// Validação do input
inputText.forEach((input) => {
  input.addEventListener("input", (event) => {
    let value = event.target.value.replace(/[^0-9]/g, "")
    event.target.value = value.trim()
  })
})

// Evento de 'submit' do formulário
form.onsubmit = (event) => {
  event.preventDefault()

  const draw = {
    amount: parseInt(numbersAmount.value),
    inputMin: parseInt(inputMin.value),
    inputMax: parseInt(inputMax.value),
  }

  if (draw.inputMin >= draw.inputMax) {
    alert("O número inicial deve ser menor que o número final")
    return
  }

  if (draw.amount > draw.inputMax - draw.inputMin) {
    alert("O número de sorteios não pode ser maior que o intervalo de números")
    return
  }

  const spaceSample = []

  for (let i = draw.inputMin; i <= draw.inputMax; i++) {
    spaceSample.push(i)
  }

  sortNumbers(draw, spaceSample)
}

let execute = 0

function sortNumbers(draw, spaceSample) {
  try {
    main.removeAttribute("id")
    main.innerHTML = ""

    const results = document.createElement("div")
    results.classList.add("results")

    const resultInfo = document.createElement("div")
    resultInfo.classList.add("resultsInfo")

    const title = document.createElement("h3")
    title.textContent = "RESULTADO DO SORTEIO"

    const subTitle = document.createElement("span")
    execute++
    subTitle.textContent = `${execute}º RESULTADO`

    resultInfo.append(title, subTitle)

    const animatedNumber = document.createElement("div")
    animatedNumber.classList.add("resultsNumber")

    results.append(resultInfo, animatedNumber)
    main.append(results)

    const sortedNumbers = drawNumbers(draw.amount, spaceSample)

    let i = 0

    function showSortedNumbers() {
      if (i < sortedNumbers.length) {
        const numberSorted = document.createElement("span")
        numberSorted.classList.add("text-animation")
        numberSorted.textContent = sortedNumbers[i]

        const animation = document.createElement("div")
        animation.classList.add("bg-animation")
        animation.append(numberSorted)
        animatedNumber.append(animation)
        i++

        // ⏱️ 5 segundos entre a revelação de cada número
        setTimeout(showSortedNumbers, 5000)
      } else {
        const button = document.createElement("button")
        button.classList.add("appear-button")
        button.innerHTML = `SORTEAR NOVAMENTE <img src="./assets/replay.svg" alt="imagem de um replay button" />`

        setTimeout(() => {
          button.style.opacity = 1
        }, 50)

        button.onclick = () => {
          main.innerHTML = ""
          sortNumbers(draw, spaceSample)
        }

        main.append(button)
      }
    }

    setTimeout(showSortedNumbers, 500)
  } catch (error) {
    alert("Não foi possível realizar o sorteio")
    console.log(error)
  }
}

function drawNumbers(amount, spaceSample) {
  // Filtra o espaço amostral: só entram números que estão na lista permitida
  const espacoFiltrado =
    NUMEROS_PERMITIDOS.length > 0
      ? spaceSample.filter((n) => NUMEROS_PERMITIDOS.includes(n))
      : spaceSample

  // Se a lista permitida não tiver números suficientes dentro do intervalo,
  // usa o que existir e avisa o usuário
  let disponiveis = espacoFiltrado

  if (espacoFiltrado.length === 0) {
    alert(
      "Nenhum número da lista permitida está dentro do intervalo escolhido. Sorteando normalmente dentro do intervalo."
    )
    disponiveis = spaceSample
  } else if (espacoFiltrado.length < amount) {
    alert(
      `Só existem ${espacoFiltrado.length} número(s) permitido(s) dentro do intervalo. Serão sorteados esses.`
    )
    amount = espacoFiltrado.length
  }

  const sortedNumbers = []
  const copySpaceSample = [...disponiveis]

  while (sortedNumbers.length < amount) {
    const random = Math.floor(Math.random() * copySpaceSample.length)
    const selectedNumber = copySpaceSample[random]
    sortedNumbers.push(selectedNumber)

    if (checkbox.checked) {
      copySpaceSample.splice(random, 1)
    }
  }

  return sortedNumbers
}
